import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IconDefinition, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { IComment } from 'src/app/model/comment';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/module/authentication/service/auth.service';


@Component({
  selector: 'mem-detail',
  templateUrl: './mem-detail.component.html',
  styleUrls: ['./mem-detail.component.sass']
})
export class MemDetailComponent implements OnInit, OnDestroy {
  private _iconUser: IconDefinition = faUser;

  private _authorId: string;
  private _authorNick: string;
  private _memId: string;

  private _comments: IComment[];
  private _commentsSubscrition: Subscription;
  private _authSubscription: Subscription;
  
  private _userId: string = null;

  constructor(private route: ActivatedRoute, private dbs: DatabaseService, private auth: AuthService) { 
    route.paramMap.subscribe(param => {
      param.has('uid') ? 
        this._authorId = param.get('uid') :
        this._authorId = null;

      param.has('nick') ? 
        this._authorNick = param.get('nick') :
        this._authorNick = null;

      param.has('id') ? 
        this._memId = param.get('id') :
        this._memId = null;
    })

    this._authSubscription = this.auth.authState$.subscribe(state => {
      state.user ? 
        this._userId = state.user.uid : 
        this._userId = null;
    })

    this._commentsSubscrition = this.dbs.getComments(this._memId).subscribe(comments => {
      this._comments = comments;
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this._commentsSubscrition.unsubscribe();
    this._authSubscription.unsubscribe();
  }

  addComment(f: NgForm){
    let comment: IComment = {
      author: {
        uid: this._authorId,
        nick: this._authorNick
      },
      date: new Date().getTime(),
      response: [],
      text: f.value.text,
      votes: []
    }

    this.dbs.setComments(this._memId, comment);
  }


}
