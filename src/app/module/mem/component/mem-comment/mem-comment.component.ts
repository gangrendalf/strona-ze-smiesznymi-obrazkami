import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { IconDefinition, faUser, faFlag, faPlus, faMinus, faReply } from '@fortawesome/free-solid-svg-icons';
import { EVote, IVote } from 'src/app/model/vote';
import { VotingCore } from 'src/app/module/shared/functions';

@Component({
  selector: 'mem-comment',
  templateUrl: './mem-comment.component.html',
  styleUrls: ['./mem-comment.component.sass']
})
export class MemCommentComponent implements OnInit {
  @Input('memID') memID: string;
  @Input('comment') comment: Comment;
  @Input('userID') userID: string;
  @Input('userNick') userNick: string;
  @Input('childComments') childComments: Comment[];

  private _iconUser: IconDefinition = faUser;
  private _iconFlag: IconDefinition = faFlag;
  private _iconPlus: IconDefinition = faPlus;
  private _iconMinus: IconDefinition = faMinus;
  private _iconReply: IconDefinition = faReply;

  private _upVotesCount: number = 0;
  private _downVotesCount: number = 0;
  private _userVote: IVote;

  private _voter: VotingCore;

  private _showResponseInput: boolean = false;

  private _responses: Comment[];

  constructor(private dbs: DatabaseService) { }
  
  ngOnInit(){
    if(!this.comment.votes)
      this.comment.votes = [];

    this._userVote = this.comment.votes.find((value) => value.uid ==   this.userID);
    this._upVotesCount = this.comment.votes.filter(vote => vote.note ==  EVote.up).length;
    this._downVotesCount = this.comment.votes.filter(vote => vote.note   == EVote.down).length;
    this._voter = new VotingCore(this.userID, this._userVote, this.comment);    

    if(this.childComments)
      this._responses = this.childComments.filter(response => response.parentID == this.comment.date.toString());
  }

  vote(note: EVote){
    this.comment = this._voter.vote(note);

    this.dbs.comment.update(this.comment, this.comment.date.toString(), this.memID);
  }

  toggleResponseInput(){
    this._showResponseInput = !this._showResponseInput;
  }

  addComment(e: Comment){
    this.dbs.comment.set(e, this.memID)
  }
}
