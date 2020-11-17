import { fakeAsync } from '@angular/core/testing';
import { combineLatest, Subscription } from 'rxjs';
import { Comment } from '../model/comment.interface';
import { ImageMetadata } from '../model/image-metadata.interface';
import { Mem } from '../model/mem.interface';
import { User } from '../model/user.interface';
import { Note, Vote } from '../model/vote.interface';
import { VotingSystem } from './voting-system';

describe(`VotingSystem`, () => {
  const templateUser: User = {
    nick: 'testUser',
    uid: 'testUserId123',
    isAdmin: false,
    isModerator: false
  };

  const templateAuthor: User = {
    nick: 'testAuthor',
    uid: 'testAuthorId123',
    isAdmin: false,
    isModerator: false
  };

  const templateImageMeta: ImageMetadata = {
    URL: 'test/url',
    uid: 'testAuthorId123',
    id: 'testImgId123'
  };

  const templateMem: Mem = {
    id: 'testMemId123',
    title: 'testTitle',
    author: templateAuthor,
    category: 'testCategory',
    creationDate: Date.now(),
    imageMetadata: templateImageMeta,
    tags: ['testTag1'],
    approved: true,
    approvalDate: Date.now(),
    approvedBy: 'testAuthorId123',
    votes: null
  };

  const templateComment: Comment = {
    id: 'testCommentId123',
    author: templateAuthor,
    date: Date.now(),
    parentCommentID: null,
    text: 'Example comment here',
    votes: null
  }

  let subscription: Subscription;
  
  afterEach(() => {
    if(subscription)
      subscription.unsubscribe();

    subscription = null;
  });

  it(`should create`, () => {
    const user: User = templateUser;
    const mem: Mem = templateMem;

    const voter = new VotingSystem(user, mem);

    expect(voter).toBeTruthy();
  });

  describe(`initiall conditions`, () => {
    it(`initially down votes count should be 0`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
  
      subscription = voter.downVotesCount.subscribe(votesCount => {
        expect(votesCount).toEqual(0, 'initialized with item with 0 votes');
      });
    }));
  
    it(`initially up votes count should be 0`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
  
      subscription = voter.upVotesCount.subscribe(votesCount => {
        expect(votesCount).toEqual(0, 'initialized with item with 0 votes');
      });
    }));
  });

  describe(`voteUp()`, () => {
    it(`should have 0 votes initially and vote up`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
  
      voter.voteUp();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          const upVotes = votes[0];
          const downVotes = votes[1];
  
          expect(upVotes).toEqual(1, 'upvotes count');
          expect(downVotes).toEqual(0, 'downvotes count');
        })
    }));
  
    it(`should store vote after vote up`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
  
      voter.voteUp();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          expect(mem.votes.length).toEqual(1);
          expect(mem.votes[0]).toEqual(<Vote>{ uid: user.uid, note: Note.up })
        })
    }));
  });

  describe(`voteDown()`, () => {
    it(`should have 0 votes initially and vote down`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
  
      voter.voteDown();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          const upVotes = votes[0];
          const downVotes = votes[1];
  
          expect(upVotes).toEqual(0, 'upvotes count');
          expect(downVotes).toEqual(1, 'downvotes count');
        })
    }));
  
    it(`should store vote after vote down`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
  
      voter.voteDown();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          expect(mem.votes.length).toEqual(1);
          expect(mem.votes[0]).toEqual(<Vote>{ uid: user.uid, note: Note.down })
        })
    }));
  });

  describe(`vote cancellation`, () => {
    it(`should vote up then cancel vote with second vote up command`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
      
      //+1
      voter.voteUp();
      //0
      voter.voteUp();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          expect(mem.votes.length).toEqual(0);
        })
    }));

    it(`should vote up then cancel vote with vote down command`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
      
      //+1
      voter.voteUp();
      //0
      voter.voteDown();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          expect(mem.votes.length).toEqual(0);
        })
    }));

    it(`should vote down then cancel vote with second vote down command`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
      
      //-1
      voter.voteDown();
      //0
      voter.voteDown();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          expect(mem.votes.length).toEqual(0);
        })
    }));

    it(`should vote down then cancel vote with vote up command`, fakeAsync(() => {
      const user: User = {...templateUser};
      const mem: Mem = JSON.parse(JSON.stringify(templateMem));
  
      const voter = new VotingSystem(user, mem);
      
      //-1
      voter.voteDown();
      //0
      voter.voteUp();
  
      subscription = combineLatest(voter.upVotesCount, voter.downVotesCount)
        .subscribe(votes => {
          expect(mem.votes.length).toEqual(0);
        })
    }));
  });
});