import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { IItem } from 'src/app/model/item';
import { IconDefinition, faSmile, faFileVideo, faFileImage } from '@fortawesome/free-solid-svg-icons';
import { testUser } from 'src/app/model/user';
import { Observable } from 'rxjs';

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

  private _itemType: ItemType;

  private iconImage: IconDefinition = faFileImage;
  private iconMovie: IconDefinition = faFileVideo;
  private iconMem: IconDefinition = faSmile;

  private _file: File = null;
  private _fileUrl: string = null;
  // private _fileUploadProgress$: Observable<number>;

  constructor(private dbs: DatabaseService) { }

  ngOnInit(){
    this.addImageBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.image);
    this.addMovieBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.movie);
    this.addMemBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.mem);
  }

  submit(f: NgForm){
    let mem: IItem = {
      title: f.value.title,
      category: f.value.category,
      tags: [f.value.tags],
      imageURL: null,
      author: testUser,
      comments: [],
      downvotes: 0,
      upvotes: 0,
      creationDate: new Date().getTime()
    }

    this.dbs.setItemAndItemInfo(mem, this._file);
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
