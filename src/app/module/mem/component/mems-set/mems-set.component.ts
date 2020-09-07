import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { PageService } from 'src/app/module/mem/service/page.service';

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
