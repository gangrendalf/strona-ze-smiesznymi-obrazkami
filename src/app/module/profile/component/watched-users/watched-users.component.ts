import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

@Component({
  selector: 'watched-users',
  templateUrl: './watched-users.component.html',
  styleUrls: ['./watched-users.component.sass']
})
export class WatchedUsersComponent implements OnDestroy {
  private _subscription: Subscription;
  public user: UserDetail;
  public watchedUsers: UserDetail[] = [];

  constructor(private dbs: DatabaseService, private route: ActivatedRoute) {
    this._subscription = route.pathFromRoot[1].paramMap
      .pipe(
        map(params => params.get('uid')),
        switchMap(uid => dbs.user.getSingle(uid)))
      .subscribe(user => {
        if(!user.watchedUsers)
          return;

        let loadedUsers: UserDetail[] = [];

        user.watchedUsers.forEach(async uid => 
          await this.getUser(uid).then(watchedUser => loadedUsers.push(watchedUser))
        )
        
        this.watchedUsers = loadedUsers;
        this.user = user;
      })
  };

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private getUser(uid) {
    return this.dbs.user.getSingle(uid).pipe(take(1)).toPromise();
  }
}
