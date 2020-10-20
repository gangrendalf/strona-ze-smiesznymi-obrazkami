import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Mem } from 'src/app/module/shared/model/mem.interface';

import { faPlus, faMinus, IconDefinition, faStar, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { combineLatest, Subscription } from 'rxjs';
import { VotingCore } from 'src/app/module/shared/functions';
import { ImageMetadata } from 'src/app/module/shared/model/image-metadata.interface';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { Router } from '@angular/router';
import { User } from 'src/app/module/shared/model/user.interface';

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

  private _user: User;
  private _memData: Mem | null;
  private _voter: VotingCore;
  
  private _authSubscription: Subscription;
  private _memSubscription: Subscription;

  constructor(private dbs: DatabaseService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if(this.memReference == null)
      return;

    this._authSubscription = 
      this.auth.authState.subscribe(authState => this._user = authState.user)

      this._memSubscription = 
      this.dbs.mem.getSingle(this.memReference.itemID)
        .subscribe(data => {
          this._memData = data;
          this.initializeVotingSystem();
      })
  }
  
  private initializeVotingSystem(){
    this._voter = new VotingCore(this._user, this._memData);
  }
  
  private openDetailView(){
    this.saveMemIntoLocalStorage();
    this.navigateIntoDetailView();
  }

  private saveMemIntoLocalStorage(){
    const localStorgeItem: string = 
      JSON.stringify(this.memReference);

    localStorage.setItem('memReference', localStorgeItem )
  }

  private navigateIntoDetailView(){
    this.router.navigate(['/mem', this._memData.author.uid, this._memData.author.nick, this._memData.id])
  }

  private voteUp(){
    const tempMemData = this._voter.voteUp() as Mem;
    this.dbs.mem.update(tempMemData, this._memData.id);
  }

  private voteDown(){
    const tempMemData = this._voter.voteDown() as Mem;
    this.dbs.mem.update(tempMemData, this._memData.id);
  }

  private approve(){
    this._memData.approved = true;
    this._memData.approvalDate = new Date().getTime();
    this._memData.approvedBy = this._user.uid

    this.memReference.approved = this._memData.approved;
    this.memReference.approvalDate = this._memData.approvalDate;

    this.dbs.mem.update(this._memData, this._memData.id);
    this.dbs.memReference.update(this.memReference, this.memReference.referenceID)
  }

  ngOnDestroy(){
    if(this._authSubscription)
      this._authSubscription.unsubscribe();
    
    if(this._memSubscription)
      this._memSubscription.unsubscribe();
  }
}
