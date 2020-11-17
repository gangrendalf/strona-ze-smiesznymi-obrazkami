import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { IconDefinition, faUser, faFlag, faPlus, faMinus, faReply } from '@fortawesome/free-solid-svg-icons';
import { VotingSystem } from "src/app/module/shared/utilities/voting-system";
import { User } from 'src/app/module/shared/model/user.interface';

@Component({
  selector: 'mem-comment',
  templateUrl: './mem-comment.component.html',
  styleUrls: ['./mem-comment.component.sass']
})
export class MemCommentComponent implements OnInit {
  @Input('memID') memID: string;
  @Input('comment') comment: Comment = null;
  @Input('user') user: User;
  @Input('childComments') childComments: Comment[];

  private _iconUser: IconDefinition = faUser;
  private _iconFlag: IconDefinition = faFlag;
  private _iconPlus: IconDefinition = faPlus;
  private _iconMinus: IconDefinition = faMinus;
  private _iconReply: IconDefinition = faReply;

  private _voter: VotingSystem;
  private _showResponseInput: boolean = false;
  private _responses: Comment[];
  private _timestamp: string;

  constructor(private dbs: DatabaseService) { }
  
  ngOnInit(){
    if(!this.comment)
      return;

    if(!this.comment.votes)
      this.comment.votes = [];

    this._voter = new VotingSystem(this.user, this.comment);    

    if(this.childComments)
      this._responses = this.childComments.filter(response => response.parentCommentID == this.comment.id);

    this._timestamp = this.formatTimestamp(this.comment.date);
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

  formatTimestamp(creationDate: number): string{
    const now = new Date().getTime();
    const secondInMilis: number = 1000;
    const minuteInMilis: number = secondInMilis * 60;
    const hourInMilis: number = minuteInMilis * 60;
    const dayInMilis: number = hourInMilis * 24;
    const monthInMilis: number = dayInMilis * 30;
    const yearInMilis: number = monthInMilis * 12;
    
    const timeDelta = now - creationDate;
    let count: number;
    let plural: string;

    if(timeDelta < minuteInMilis){
      count = Math.round(timeDelta / secondInMilis);
      plural = count < 2 ? 'sekundę' : count < 5 ? 'sekundy' : 'sekund';
    }else if (timeDelta < hourInMilis){
      count = Math.round(timeDelta / minuteInMilis);
      plural = count < 2 ? 'minutę' : count < 5 ? 'minuty' : 'minut';
    }else if (timeDelta < dayInMilis){
      count = Math.round(timeDelta / hourInMilis);
      plural = count < 2 ? 'godzinę' : count < 5 ? 'godziny' : 'godzin';
    }else if (timeDelta < monthInMilis){
      count = Math.round(timeDelta / dayInMilis);
      plural = count < 2 ? 'dzień' : 'dni';
    }else if (timeDelta < yearInMilis){
      count = Math.round(timeDelta / monthInMilis);
      plural = count < 2 ? 'miesiąc' : count < 5 ? 'miesiące' : 'miesięcy';
    }else{
      count = Math.round(timeDelta / yearInMilis);
      plural = count < 2 ? 'rok' : count < 5 ? 'lata' : 'lat';
    }

    const displayString = `${count} ${plural} temu`;

    return displayString;    
  }
}
