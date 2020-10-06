import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Mem } from 'src/app/module/shared/model/mem.interface';
import { IconDefinition, faSmile, faFileVideo, faFileImage } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/module/shared/model/user.interface';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { take, map } from 'rxjs/operators';
import { Category } from 'src/app/module/shared/model/category.interface';
import { CategoryComponent } from 'src/app/module/navigation/component/buttons-category/buttons-category.component';

@Component({
  selector: 'mem-add-form',
  templateUrl: './mem-add-form.component.html',
  styleUrls: ['./mem-add-form.component.sass']
})
export class MemAddFormComponent implements OnInit {
  @ViewChild('addImageBox', {static: true}) addImageBox: ElementRef<HTMLDivElement>;
  @ViewChild('addMovieBox', {static: true}) addMovieBox: ElementRef<HTMLDivElement>;
  @ViewChild('addMemBox', {static: true}) addMemBox: ElementRef<HTMLDivElement>;
  @ViewChild('f', {static: true}) memForm: ElementRef<FormGroup>;

  private _user: User = null;

  private _itemType: ItemType;

  private iconImage: IconDefinition = faFileImage;
  private iconMovie: IconDefinition = faFileVideo;
  private iconMem: IconDefinition = faSmile;

  private _file: File = null;
  private _fileUrl: string = null;

  private _categories: Category[];
  // private _fileUploadProgress$: Observable<number>;

  constructor(private dbs: DatabaseService, private auth: AuthService) { }

  async ngOnInit(){
    this.addImageBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.image);
    this.addMovieBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.movie);
    this.addMemBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.mem);

    this.auth.authState$
      .pipe(
        take(1),
        map(authState => {
          let user: User = {
            uid: authState.user.uid,
            nick: authState.user.nick
          };
          return user;
        }))
      .subscribe(user => this._user = user );

    this._categories = await this.dbs.category.getAll().pipe(take(1)).toPromise();
  }

  submit(f: NgForm){
    let mem: Mem = {
      title: f.value.title,
      category: f.value.category,
      tags: [f.value.tags],
      imageURL: null,
      author: this._user,
      votes: null,
      creationDate: new Date().getTime()
    }

    this.dbs.createItemAndItemInfo(mem, this._file);
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
