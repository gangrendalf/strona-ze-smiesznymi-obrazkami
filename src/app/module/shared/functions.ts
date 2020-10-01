import { IVote, EVote } from 'src/app/model/vote';
import { IComment } from 'src/app/model/comment';
import { IItem } from 'src/app/model/item';

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
    constructor(
        public userId: string, 
        public userVote: IVote, 
        public item: IItem | IComment){
        //constructor
    }

    public vote(note: EVote): any{ // : IItem | IComment
      const userDidVote: boolean = (this.userVote != null);
      const userChangedNote: boolean = userDidVote ? (this.userVote.note != note) : false;
      const userResetNote: boolean =  userDidVote ? (this.userVote.note == note) : false;

      console.log(userDidVote, userChangedNote, userResetNote);

        if(userDidVote && userResetNote)
          this.userVote.note = EVote.none;
        else if(userDidVote && userChangedNote)
          this.userVote.note = note;
        else {
          this.userVote = {
            uid: this.userId, 
            note: note };
          this.item.votes.push(this.userVote);
        }
    
        if(this.userVote.note == EVote.none){
          let voteIndex = this.item.votes.indexOf(this.userVote);
          this.item.votes.splice(voteIndex, 1);
          this.userVote = null;
        }

        return this.item;
    }
}
