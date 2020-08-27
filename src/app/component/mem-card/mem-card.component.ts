import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/service/database.service';
import { IItem } from 'src/app/model/item';
import { IItemInfo } from 'src/app/model/item-info';

@Component({
  selector: 'mem-card',
  templateUrl: './mem-card.component.html',
  styleUrls: ['./mem-card.component.sass']
})
export class MemCardComponent implements OnInit {
  @Input('itemId') memId: string;
  memData: Promise<IItem> | null = null;


  constructor(private dbs: DatabaseService) { }

  ngOnInit() {
    this.memData = this.dbs.getItem(this.memId);
  }

}
