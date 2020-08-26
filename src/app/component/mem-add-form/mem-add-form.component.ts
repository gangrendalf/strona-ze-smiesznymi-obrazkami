import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DatabaseService } from 'src/app/service/database.service';
import { Mem } from 'src/app/model/mem';
import { testUser } from 'src/app/model/user';

@Component({
  selector: 'mem-add-form',
  templateUrl: './mem-add-form.component.html',
  styleUrls: ['./mem-add-form.component.sass']
})
export class MemAddFormComponent implements OnInit {
  @ViewChild('f', {static: true}) memForm: ElementRef<FormGroup>;

  constructor(private dbs: DatabaseService) { }

  ngOnInit() {
    
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
