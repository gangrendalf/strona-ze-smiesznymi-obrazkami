import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { IComment } from 'src/app/model/comment';
import { Subscription } from 'rxjs';
import { IconDefinition, faUser, faFlag, faPlus, faMinus, faReply } from '@fortawesome/free-solid-svg-icons';
import { EVote, IVote } from 'src/app/model/vote';
import { NgForm } from '@angular/forms';
import { VotingCore } from 'src/app/module/shared/functions';

@Component({
  selector: 'mem-comment',
  templateUrl: './mem-comment.component.html',
  styleUrls: ['./mem-comment.component.sass']
})
export class MemCommentComponent implements OnInit {
  @Input('memId') memId: string;
  @Input('comment') comment: IComment;
  @Input('userId') userId: string;

  private _iconUser: IconDefinition = faUser;
  private _iconFlag: IconDefinition = faFlag;
  private _iconPlus: IconDefinition = faPlus;
  private _iconMinus: IconDefinition = faMinus;
  private _iconReply: IconDefinition = faReply;

  private _upVotesCount: number = 0;
  private _downVotesCount: number = 0;
  private _userVote: IVote;

  private _voter: VotingCore;

  constructor(private dbs: DatabaseService) { }
  
  ngOnInit(){
    if(!this.comment.votes)
          this.comment.votes = [];

        this._userVote = this.comment.votes.find((value) => value.uid ==   this.userId);
        this._upVotesCount = this.comment.votes.filter(vote => vote.note ==  EVote.up).length;
        this._downVotesCount = this.comment.votes.filter(vote => vote.note   == EVote.down).length;

    this._voter = new VotingCore(this.userId, this._userVote, this.comment);
  }

  vote(note: EVote){
    this.comment = this._voter.vote(note);
    
    this.dbs.updateComment(this.memId, this.comment);
  }
}
