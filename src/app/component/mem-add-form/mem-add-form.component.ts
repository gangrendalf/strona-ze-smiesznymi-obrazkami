import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DatabaseService } from 'src/app/service/database.service';
import { Mem } from 'src/app/model/mem';
import { testUser } from 'src/app/model/user';
import { IconDefinition, faSmile, faFileVideo, faFileImage } from '@fortawesome/free-solid-svg-icons';

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

  constructor(private dbs: DatabaseService) { }

  ngOnInit(){
    this.addImageBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.image);
    this.addMovieBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.movie);
    this.addMemBox.nativeElement.addEventListener('click', e => this._itemType = ItemType.mem);
  }

  test(f: NgForm){
    let mem: Mem = {
      title: f.value.title,
      category: f.value.category,
      tags: [f.value.tags],
      image: f.value.image,
      author: testUser,
      comments: [],
      downvotes: 0,
      upvotes: 0,
      creationDate: new Date().getTime()
    }

    this.dbs.setMem(mem)
  }

}

enum ItemType{
  image = 'image',
  movie = 'movie',
  mem = 'mem'
}
