import { Component, Input, OnInit } from '@angular/core';
import { faEnvelope, faEye, faEyeSlash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';

@Component({
  selector: 'profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.sass']
})
export class ProfileActionsComponent {
  public watchUserIcon: IconDefinition = faEye;
  public unwatchUserIcon: IconDefinition = faEyeSlash;
  public messageIcon: IconDefinition = faEnvelope;

  @Input('authUser') authUser: UserDetail;
  @Input('user') user: UserDetail;
  
  constructor(private dbs: DatabaseService) { }

  public get isUserWatchedByAuthUser(){
    return this.authUser.watchedUsers
      .some(watchedUserId => watchedUserId === this.user.uid);
  }

  public watchUser(){
    if(!this.authUser.watchedUsers)
      this.authUser.watchedUsers = [];

    if(this.authUser.watchedUsers.some(watchedUserId => watchedUserId === this.user.uid))
      return;

    this.authUser.watchedUsers.push(this.user.uid);
    this.dbs.user.update(this.authUser);
  }

  public unwatchUser(){
    if(!this.authUser.watchedUsers)
      return;
    
    const userIndex = this.authUser.watchedUsers.findIndex(watchedUserId => watchedUserId === this.user.uid);
    
    if(userIndex === -1)
      return;

    this.authUser.watchedUsers.splice(userIndex, 1);
    this.dbs.user.update(this.authUser);
  }

  public sendMessageTo(){

  }

}
