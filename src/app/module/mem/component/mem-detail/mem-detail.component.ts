import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { IComment } from 'src/app/model/comment';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { IAuthState } from 'src/app/model/auth-state';

@Component({
  selector: 'mem-detail',
  templateUrl: './mem-detail.component.html',
  styleUrls: ['./mem-detail.component.sass']
})

export class MemDetailComponent implements OnDestroy {
  private _memID: string;
  private _authorID: string;
  private _authorNick: string;
  private _userID: string = null;
  private _userNick: string = null;

  private _rootComments: IComment[];
  private _childComments: IComment[];

  private _commentsSubscription: Subscription;
  private _authSubscription: Subscription;
  private _routeSubscription: Subscription;
  
  constructor(private route: ActivatedRoute, private dbs: DatabaseService, private auth: AuthService) { 
    this._routeSubscription = route.paramMap.subscribe(param => this.extractMemIdentifiers(param));
    this._authSubscription = auth.authState$.subscribe(state => this.extractUserData(state));
    this._commentsSubscription = dbs.getComments(this._memID).subscribe(comments => this.separateRootAndChildComments(comments));
  }

  ngOnDestroy(){
    this._commentsSubscription.unsubscribe();
    this._authSubscription.unsubscribe();
    this._routeSubscription.unsubscribe();
  }

  addComment(comment: IComment){
    this.dbs.setComments(this._memID, comment);
  }

  extractMemIdentifiers(param: ParamMap){
    if( !(param.has('uid') && param.has('nick') && param.has('id')) )
      return;

    this._authorID = param.get('uid');
    this._authorNick = param.get('nick');
    this._memID = param.get('id');
  }

  extractUserData(state: IAuthState){
    if(!state.user)
      return;

    this._userID = state.user.uid;
    this._userNick = state.user.nick;
  }

  separateRootAndChildComments(comments: IComment[]){
    this._rootComments = comments.filter(comment => comment.parentID == null);
    this._childComments = comments.filter(comment => comment.parentID != null);
  }
}
