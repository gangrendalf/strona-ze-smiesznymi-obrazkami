import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/service/database.service';
import { PageService } from 'src/app/service/page.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mems-set',
  templateUrl: './mems-set.component.html',
  styleUrls: ['./mems-set.component.sass']
})
export class MemsSetComponent implements OnInit {
  private _memIds: string[];

  constructor(private ps: PageService, private dbs: DatabaseService) { }

  async ngOnInit() {
    this.ps.currentPageMemSet$.subscribe(memSet =>{
      this._memIds = memSet;
    })
  }

}
