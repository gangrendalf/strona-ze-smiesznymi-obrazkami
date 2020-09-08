import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { IItem } from 'src/app/model/item';

import { faPlus, faMinus, IconDefinition, faStar, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { IUser } from 'src/app/model/user';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { IVote, EVote } from 'src/app/model/vote';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mem-card',
  templateUrl: './mem-card.component.html',
  styleUrls: ['./mem-card.component.sass']
})
export class MemCardComponent implements OnInit, OnDestroy {
  @Input('itemId') memId: string;

  private _plusIcon: IconDefinition = faPlus;
  private _minusIcon: IconDefinition = faMinus;
  private _starIcon: IconDefinition = faStar;
  private _commentIcon: IconDefinition = faCommentAlt;

  private _memData: IItem | null;
  private _authorData: IUser | null;
  
  private _userId: string = null;
  private _userVote: IVote;
  private _upVotesCount: number = 0;
  private _downVotesCount: number = 0;

  private _authSubscription: Subscription;
  private _memSubscription: Subscription;

  constructor(private dbs: DatabaseService, private auth: AuthService) { }

  async ngOnInit() {
    this._authSubscription = this.auth.authState$.subscribe(state => {
      state.user ? 
        this._userId = state.user.uid : 
        this._userId = null;
    })

    this._memSubscription = this.dbs.getItem(this.memId)
      .subscribe(mem => {
        this._memData = mem;
        if(!this._authorData)
          this.dbs.getUser(mem.authorID).then(
            res => this._authorData = res,
            rej => this._authorData = null
          );

        if(!this._memData.votes)
          this._memData.votes = [];

        if(this._memData.votes.some(v => v.uid = this._userId))
          this._userVote = this._memData.votes.find((value) => value.uid ==   this._userId);

        this._upVotesCount = this._memData.votes.filter(vote => vote.note ==  EVote.up).length;
        this._downVotesCount = this._memData.votes.filter(vote => vote.note   == EVote.down).length;
      });
  }

  ngOnDestroy(){
    this._authSubscription.unsubscribe();
    this._memSubscription.unsubscribe();
  }

  vote(note: EVote){
    if(this._userVote && this._userVote.note == note)
      this._userVote.note = EVote.none;
    else if(this._userVote && this._userVote.note != note)
      this._userVote.note = note;
    else {
      this._userVote = {
        uid: this._userId, 
        note: note };
      this._memData.votes.push(this._userVote);
    }

    if(this._userVote.note == EVote.none){
      let voteIndex = this._memData.votes.indexOf(this._userVote);
      this._memData.votes.splice(voteIndex, 1);
      this._userVote = null;
    }

    this.dbs.updateItem(this.memId, this._memData);
  }

}
