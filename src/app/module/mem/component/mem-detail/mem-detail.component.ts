import { Component, OnDestroy, OnInit } from '@angular/core';

import { Comment } from 'src/app/module/shared/model/comment.interface';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { User } from 'src/app/module/shared/model/user.interface';

@Component({
  selector: 'mem-detail',
  templateUrl: './mem-detail.component.html',
  styleUrls: ['./mem-detail.component.sass']
})

export class MemDetailComponent implements OnInit, OnDestroy {
  private _memReference: MemReference = null;
  private _user: User;

  private _rootComments: Comment[];
  private _childComments: Comment[];

  private _commentsSubscription: Subscription;
  private _authSubscription: Subscription;
  
  constructor(private dbs: DatabaseService, private auth: AuthService) { 



  }

  ngOnInit(){
    this.loadMemFromLocalStorage();
    
    this._authSubscription = 
      this.auth.authState
        .subscribe(authState => this._user = authState.user);

    this._commentsSubscription = 
      this.dbs.comment
        .getAll(this._memReference.itemID)
        .subscribe(comments => this.separateRootAndChildComments(comments));
  }

  ngOnDestroy(){
    this._commentsSubscription.unsubscribe();
    this._authSubscription.unsubscribe();
  }

  addComment(comment: Comment){
    this.dbs.comment.set(comment, this._memReference.itemID);
  }

  separateRootAndChildComments(comments: Comment[]){
    this._rootComments = comments.filter(comment => comment.parentCommentID == null);
    this._childComments = comments.filter(comment => comment.parentCommentID != null);
  }

  private loadMemFromLocalStorage(){
    const localStorageString = localStorage.getItem('memReference');
    const localStorageObject = JSON.parse(localStorageString);
    this._memReference = localStorageObject;
  }
}
