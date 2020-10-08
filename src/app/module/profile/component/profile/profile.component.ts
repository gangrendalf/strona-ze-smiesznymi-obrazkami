import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  private _userID: string = null;

  constructor(private route: ActivatedRoute, private dbs: DatabaseService) { 
    route.paramMap.subscribe(paramMap => {
      if(paramMap.has('uid'))
        this._userID = paramMap.get('uid');
      else
        console.error('missing uid in routeParamMap');
    })
  }

  ngOnInit() {
  }

}
