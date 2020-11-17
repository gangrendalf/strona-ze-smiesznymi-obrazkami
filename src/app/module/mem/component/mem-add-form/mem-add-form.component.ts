import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Mem } from 'src/app/module/shared/model/mem.interface';
import { IconDefinition, faSmile, faFileVideo, faFileImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/module/shared/model/user.interface';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { take, map } from 'rxjs/operators';
import { Category } from 'src/app/module/shared/model/category.interface';
import { ImageMetadata } from 'src/app/module/shared/model/image-metadata.interface';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { Router } from '@angular/router';
import { ImageLoader } from 'src/app/module/shared/utilities/image-loader';

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

  private imageLoader: ImageLoader;
  private imageLoaderError: string;

  private _categories: Category[];
  private _tags: string[] = ['obrazek'];

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

    this.imageLoader = new ImageLoader(ImageLoader.typeOfImage.mem);
    this.imageLoaderError = null;
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

  async loadFile(event){
    const file: File = event.target.files[0];
    this.imageLoaderError = null;
    
    try {
      await this.imageLoader.createImageFromFile(file, this._user.uid);
    } catch (error) {
      this.imageLoaderError = error;
      return;
   }

    const imgContainerRef = document.getElementById('imageContainer');
    const oldImg = imgContainerRef.querySelector('img');
    const newImg = this.imageLoader.getImageHTMLElement();

    if(oldImg)
      imgContainerRef.replaceChild(newImg, oldImg)
    else
      imgContainerRef.appendChild(newImg);
  }

  async submit(f: NgForm){
    const imageMetadata: ImageMetadata = this.imageLoader.getMetadata() 

    const uploadedImage = (await this.dbs.image.set(imageMetadata)) as ImageMetadata;
    this.imageLoader.updateMetadata(uploadedImage);

    const mem: Mem = {
      title: f.value.title,
      category: f.value.category,
      tags: this._tags,
      imageMetadata: uploadedImage,
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
          imageID: res.imageMetadata.id,
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
}

enum ItemType{
  image = 'image',
  movie = 'movie',
  mem = 'mem'
}
