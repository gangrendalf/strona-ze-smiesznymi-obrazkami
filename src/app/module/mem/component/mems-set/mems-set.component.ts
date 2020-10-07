import { Component, OnInit } from '@angular/core';
import { PageService } from 'src/app/module/mem/service/page.service';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';

@Component({
  selector: 'mems-set',
  templateUrl: './mems-set.component.html',
  styleUrls: ['./mems-set.component.sass']
})
export class MemsSetComponent {
  private _memsReference: MemReference[];

  constructor(private ps: PageService) { 
    this.ps.activePageMemCollection$
      .subscribe(memCollection => this._memsReference = memCollection);
  }
}
