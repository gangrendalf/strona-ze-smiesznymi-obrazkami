import { Component, OnInit } from '@angular/core';
import { PageService } from 'src/app/module/mem/service/page.service';

@Component({
  selector: 'mems-set',
  templateUrl: './mems-set.component.html',
  styleUrls: ['./mems-set.component.sass']
})
export class MemsSetComponent {
  private _memIds: string[];

  constructor(private ps: PageService) { 
    this.ps.activePageMemCollection$
      .subscribe(memCollection => this._memIds = memCollection);
  }
}
