import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Mem } from 'src/app/module/shared/model/mem.interface';

import { faPlus, faMinus, IconDefinition, faStar, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { IVote, EVote } from 'src/app/model/vote';
import { combineLatest, Subscription } from 'rxjs';
import { VotingCore } from 'src/app/module/shared/functions';
import { IAuthState } from 'src/app/model/auth-state';
import { Image } from 'src/app/module/shared/model/image.interface';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'mem-card',
  templateUrl: './mem-card.component.html',
  styleUrls: ['./mem-card.component.sass']
})
export class MemCardComponent implements OnInit, OnDestroy {
  @Input('memReference') memReference: MemReference;

  private _plusIcon: IconDefinition = faPlus;
  private _minusIcon: IconDefinition = faMinus;
  private _starIcon: IconDefinition = faStar;
  private _commentIcon: IconDefinition = faCommentAlt;

  private _memData: Mem | null;
  private _imageData: Image;
  
  private _userID: string = null;
  private _userVote: IVote;
  private _upVotesCount: number = 0;
  private _downVotesCount: number = 0;
  private _voter: VotingCore;

  private _authSubscription: Subscription;
  private _memSubscription: Subscription;

  constructor(private dbs: DatabaseService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this._authSubscription = this.auth.authState$.subscribe(state => this.extractUserData(state))

    this._memSubscription = combineLatest(this.dbs.mem.getSingle(this.memReference.itemID), this.dbs.image.getSingle(this.memReference.imageID, this.memReference.authorID))
      .subscribe(data => {
        this._memData = data[0];
        this._imageData = data[1];

        this.extractMemData(data[0]);

        this.initializeVotingSystem();
      })
  }
  
  private extractUserData(state: IAuthState){
    if(!state.user)
      return;

    this._userID = state.user.uid;
  }

  private extractMemData(mem: Mem){
    if(!mem)
      return;

    
    if(!this._memData.votes)
      this._memData.votes = [];

    this._userVote = this._memData.votes.find((value) => value.uid ==   this._userID);
    this._upVotesCount = this._memData.votes.filter(vote => vote.note ==  EVote.up).length;
    this._downVotesCount = this._memData.votes.filter(vote => vote.note   == EVote.down).length;
  }

  private initializeVotingSystem(){
    this._voter = new VotingCore(this._userID, this._userVote, this._memData);
  }

  private vote(note: EVote){
    this._memData = this._voter.vote(note);
    this.dbs.mem.update(this._memData, this.memReference.itemID);
  }
  
  private saveMemIntoLocalStorage(){
    const localStorgeItem: string = 
      JSON.stringify({
        'itemID': this.memReference.itemID,
        'authorID': this.memReference.authorID,
        'imageID': this.memReference.imageID,
        'creationDate': this.memReference.creationDate.toString(),
        'category': this.memReference.category,
        'approved': this.memReference.approved ? 'true' : 'false',
        'approvalDate': this.memReference.approvalDate ? this.memReference.approvalDate.toString() : null
      });

    localStorage.setItem('memReference', localStorgeItem )
  }

  private navigateIntoDetailView(){
    this.router.navigate(['/mem', this._memData.author.uid, this._memData.author.nick, this._memData.id])
  }

  private openDetailView(){
    this.saveMemIntoLocalStorage();
    this.navigateIntoDetailView();
  }

  ngOnDestroy(){
    this._authSubscription.unsubscribe();
    this._memSubscription.unsubscribe();
  }
}
