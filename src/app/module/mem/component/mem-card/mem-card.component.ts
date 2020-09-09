import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { IItem } from 'src/app/model/item';

import { faPlus, faMinus, IconDefinition, faStar, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { IVote, EVote } from 'src/app/model/vote';
import { Subscription } from 'rxjs';
import { VotingCore } from 'src/app/module/shared/functions';

@Component({
  selector: 'mem-card',
  templateUrl: './mem-card.component.html',
  styleUrls: ['./mem-card.component.sass']
})
export class MemCardComponent implements OnInit, OnDestroy {
  @Input('memId') memId: string;

  private _plusIcon: IconDefinition = faPlus;
  private _minusIcon: IconDefinition = faMinus;
  private _starIcon: IconDefinition = faStar;
  private _commentIcon: IconDefinition = faCommentAlt;

  private _memData: IItem | null;
  
  private _userId: string = null;
  private _userVote: IVote;
  private _upVotesCount: number = 0;
  private _downVotesCount: number = 0;
  private _voter: VotingCore;

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
        
        if(!this._memData.votes)
          this._memData.votes = [];

        this._userVote = this._memData.votes.find((value) => value.uid ==   this._userId);
        this._upVotesCount = this._memData.votes.filter(vote => vote.note ==  EVote.up).length;
        this._downVotesCount = this._memData.votes.filter(vote => vote.note   == EVote.down).length;

        this._voter = new VotingCore(this._userId, this._userVote, this._memData);
      });
  }

  ngOnDestroy(){
    this._authSubscription.unsubscribe();
    this._memSubscription.unsubscribe();
  }

  vote(note: EVote){
    this._memData = this._voter.vote(note);
    this.dbs.updateItem(this.memId, this._memData);
  }

}
