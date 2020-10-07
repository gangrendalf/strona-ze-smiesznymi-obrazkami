import { observable, Observable, ReplaySubject, Subject } from 'rxjs';
import { IVote, EVote } from 'src/app/model/vote';
import { Comment } from 'src/app/module/shared/model/comment.interface';
import { Mem } from 'src/app/module/shared/model/mem.interface';
import { User } from './model/user.interface';

export function disableScroll(){
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('wheel', preventDefault, { passive: false });
    document.addEventListener('scroll', preventDefault, { passive: false });
}

export function enableScroll(){
    document.removeEventListener('touchmove', preventDefault);
    document.removeEventListener('wheel', preventDefault);
    document.removeEventListener('scroll', preventDefault);
}

function preventDefault(e: Event) {
    e.preventDefault();
}

export class VotingCore{
  private _upVotesCount$: ReplaySubject<number> = new ReplaySubject(1);
  private _downVotesCount$: ReplaySubject<number> = new ReplaySubject(1);
  private _userVote: IVote = null;
  private _userVoted: boolean = false

  constructor(private user: User, private item: Mem | Comment){
    this.checkAndUpdateNotesCount();
  }
  
  public get upVotesCount(): Observable<number>{
    return this._upVotesCount$.asObservable();
  }

  public get downVotesCount(): Observable<number>{
    return this._downVotesCount$.asObservable();
  }

  public voteUp(): Mem | Comment{
    this.vote(EVote.up);

    return this.item;
  }

  public voteDown(): Mem | Comment{
    this.vote(EVote.down);
    
    return this.item;
  }

  private vote(note: EVote){
    this.checkUserVote();
    this.calculateNote(note);
    this.checkAndUpdateNotesCount();
  }

  private checkUserVote(){
    this._userVoted = this.item.votes.some(vote => vote.uid == this.user.uid);
    
    if(!this._userVoted)
      return;

    this._userVote = this.item.votes.find(vote => vote.uid == this.user.uid);
  }

  private calculateNote(note: EVote){
    if(!this._userVoted){
      this._userVote = 
        {
          note: note,
          uid: this.user.uid
        }

      this.item.votes.push(this._userVote);
    }

    if(this._userVoted && note != this._userVote.note)
      this._userVote.note = note;

    if(this._userVoted && note == this._userVote.note){
      const i = this.item.votes.findIndex(vote => vote.uid == this.user.uid);
      this.item.votes.splice(i);
    }
  }

  private checkAndUpdateNotesCount(){
    const upVotes = 
      this.item.votes 
        ? this.item.votes.filter(vote => vote.note == EVote.up).length 
        : 0;

    const downVotes = 
      this.item.votes 
        ? this.item.votes.filter(vote => vote.note == EVote.down).length
        : 0;

    this._upVotesCount$.next(upVotes);
    this._downVotesCount$.next(downVotes);
  }
}
