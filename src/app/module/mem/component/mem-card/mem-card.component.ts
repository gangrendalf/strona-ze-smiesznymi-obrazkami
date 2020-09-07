import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { IItem } from 'src/app/model/item';

import { faPlus, faMinus, IconDefinition, faStar, faCommentAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'mem-card',
  templateUrl: './mem-card.component.html',
  styleUrls: ['./mem-card.component.sass']
})
export class MemCardComponent implements OnInit {
  @Input('itemId') memId: string;

  private _plusIcon: IconDefinition = faPlus;
  private _minusIcon: IconDefinition = faMinus;
  private _starIcon: IconDefinition = faStar;
  private _commentIcon: IconDefinition = faCommentAlt;

  private _memData: Promise<IItem> | null = null;


  constructor(private dbs: DatabaseService) { }

  ngOnInit() {
    this._memData = this.dbs.getItem(this.memId);
  }

}
