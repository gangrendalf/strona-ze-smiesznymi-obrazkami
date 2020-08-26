import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/service/database.service';
import { Mem } from 'src/app/model/mem';

@Component({
  selector: 'mem-card',
  templateUrl: './mem-card.component.html',
  styleUrls: ['./mem-card.component.sass']
})
export class MemCardComponent implements OnInit {
  @Input('memId') memId: string;
  memData: Promise<Mem> | null = null;


  constructor(private dbs: DatabaseService) { }

  ngOnInit() {
    this.memData = this.dbs.getMem(this.memId);
  }

}
