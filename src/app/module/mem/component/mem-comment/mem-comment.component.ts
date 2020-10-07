import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { IconDefinition, faUser, faFlag, faPlus, faMinus, faReply } from '@fortawesome/free-solid-svg-icons';
import { EVote, IVote } from 'src/app/model/vote';
import { VotingCore } from 'src/app/module/shared/functions';
import { User } from 'src/app/module/shared/model/user.interface';

@Component({
  selector: 'mem-comment',
  templateUrl: './mem-comment.component.html',
  styleUrls: ['./mem-comment.component.sass']
})
export class MemCommentComponent implements OnInit {
  @Input('memID') memID: string;
  @Input('comment') comment: Comment;
  @Input('user') user: User;
  @Input('childComments') childComments: Comment[];

  private _iconUser: IconDefinition = faUser;
  private _iconFlag: IconDefinition = faFlag;
  private _iconPlus: IconDefinition = faPlus;
  private _iconMinus: IconDefinition = faMinus;
  private _iconReply: IconDefinition = faReply;

  private _voter: VotingCore;

  private _showResponseInput: boolean = false;

  private _responses: Comment[];

  constructor(private dbs: DatabaseService) { }
  
  ngOnInit(){
    if(!this.comment.votes)
      this.comment.votes = [];

    this._voter = new VotingCore(this.user, this.comment);    

    if(this.childComments)
      this._responses = this.childComments.filter(response => response.parentCommentID == this.comment.id);
  }

  voteUp(){
    const tempCommentData = this._voter.voteUp() as Comment;
    this.dbs.comment.update(tempCommentData, this.comment.id, this.memID);
  }

  voteDown(){
    const tempCommentData = this._voter.voteDown() as Comment;
    this.dbs.comment.update(tempCommentData, this.comment.id, this.memID);
  }

  toggleResponseInput(){
    this._showResponseInput = !this._showResponseInput;
  }

  addComment(e: Comment){
    this.dbs.comment.set(e, this.memID)
  }
}
