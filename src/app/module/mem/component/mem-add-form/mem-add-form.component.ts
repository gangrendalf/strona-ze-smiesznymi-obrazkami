import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Mem } from 'src/app/module/shared/model/mem.interface';
import { IconDefinition, faSmile, faFileVideo, faFileImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/module/shared/model/user.interface';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { take, map } from 'rxjs/operators';
import { Category } from 'src/app/module/shared/model/category.interface';
import { Image } from 'src/app/module/shared/model/image.interface';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'mem-add-form',
  templateUrl: './mem-add-form.component.html',
  styleUrls: ['./mem-add-form.component.sass']
})
export class MemAddFormComponent implements OnInit {
  @ViewChild('addImageBox', {static: true}) addImageBox: ElementRef<HTMLDivElement>;
  @ViewChild('addMovieBox', {static: true}) addMovieBox: ElementRef<HTMLDivElement>;
  @ViewChild('addMemBox', {static: true}) addMemBox: ElementRef<HTMLDivElement>;

  private _user: User = null;

  private _itemType: ItemType;

  private iconImage: IconDefinition = faFileImage;
  private iconMovie: IconDefinition = faFileVideo;
  private iconMem: IconDefinition = faSmile;
  private iconTimes: IconDefinition = faTimes;

  private _file: File = null;
  private _fileUrl: string = null;

  private _categories: Category[];
  private _tags: string[] = [];

  // private _fileUploadProgress$: Observable<number>;

  constructor(private dbs: DatabaseService, private auth: AuthService, private router: Router) { }

  async ngOnInit(){
    this.addImageBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.image);
    this.addMovieBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.movie);
    this.addMemBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.mem);

    this.auth.authState
      .pipe(take(1))
      .subscribe(authState => this._user = authState.user );

    this._categories = await this.dbs.category.getAll().pipe(take(1)).toPromise();
  }

  private addTag(tagRef: NgModel){
    const tag = tagRef.value;
    const tagExist = this._tags.some(t => t == tag);

    if(!tagExist)
      this._tags.push(tag);

    tagRef.reset();
  }

  private deleteTag(tag: string){
    const index: number = this._tags.indexOf(tag);
    this._tags.splice(index, 1)
  }

  async submit(f: NgForm){
    const image: Image = ((await this.dbs.image.set({uid: this._user.uid, file: this._file})) as Image);
    
    const mem: Mem = {
      title: f.value.title,
      category: f.value.category,
      tags: this._tags,
      image: image,
      author: this._user,
      votes: null,
      creationDate: new Date().getTime(),
      approved: false,
      approvalDate: null,
      approvedBy: null
    }

    this.dbs.mem.set(mem)
      .then((res: Mem) => {
        const memRef: MemReference = {
          itemID: res.id,
          authorID: res.author.uid,
          imageID: res.image.id,
          category: res.category,
          creationDate: res.creationDate,
          approved: res.approved,
          approvalDate: res.approvalDate,
          tags: res.tags
        }
        return memRef;
      }).then((memRef) => {
        return this.dbs.memReference.set(memRef)
      }).then(
        (success) => this.router.navigate(['/waiting-room'])
      ).catch(
        (fail) => this.router.navigate(['/something-goes-wrong'])
      );
  }

  loadFile(event){
    this._file = event.target.files[0];
    this._fileUrl = URL.createObjectURL(this._file);

    const img = document.createElement('img');
    img.setAttribute('src', this._fileUrl);
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.padding = '20px';
    img.style.width = '100%';
    img.style.maxHeight = '300px'

    const imgRef = document.getElementById('imageContainer');
    imgRef.appendChild(img);
  }
}

enum ItemType{
  image = 'image',
  movie = 'movie',
  mem = 'mem'
}
