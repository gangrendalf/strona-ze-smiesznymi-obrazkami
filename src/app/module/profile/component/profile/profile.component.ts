import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { faCamera, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  private _cameraIcon: IconDefinition = faCamera;

  private _userID: string = null;
  private _user$: Observable<UserDetail>;

  constructor(private route: ActivatedRoute, private dbs: DatabaseService) { 
    this._userID = route.snapshot.paramMap.get('uid');

    this._user$ = this.dbs.user.getSingle(this._userID);
  }

  ngOnInit() {
  }

}
