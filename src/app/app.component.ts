import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './service/database.service';
import { PageService } from './service/page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'smieszne-obrazki';

  constructor() {}

  async ngOnInit(){
  }


}
