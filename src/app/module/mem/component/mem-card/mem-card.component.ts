import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Mem } from 'src/app/module/shared/model/mem.interface';

import { faPlus, faMinus, IconDefinition, faStar, faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { combineLatest, Subscription } from 'rxjs';
import { VotingCore } from 'src/app/module/shared/functions';
import { Image } from 'src/app/module/shared/model/image.interface';
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
  private _imageData: Image;
  private _voter: VotingCore;
  
  private _authSubscription: Subscription;
  private _memSubscription: Subscription;

  constructor(private dbs: DatabaseService, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this._authSubscription = 
      this.auth.authState.subscribe(authState => this._user = authState.user)

      this._memSubscription = 
      combineLatest(this.dbs.mem.getSingle(this.memReference.itemID), this.dbs.image.getSingle(this.memReference.imageID, this.memReference.authorID))
        .subscribe(data => {
          this._memData = data[0];
          this._imageData = data[1];

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

  voteUp(){
    const tempMemData = this._voter.voteUp() as Mem;
    this.dbs.mem.update(tempMemData, this._memData.id);
  }

  voteDown(){
    const tempMemData = this._voter.voteDown() as Mem;
    this.dbs.mem.update(tempMemData, this._memData.id);
  }

  ngOnDestroy(){
    this._authSubscription.unsubscribe();
    this._memSubscription.unsubscribe();
  }
}
