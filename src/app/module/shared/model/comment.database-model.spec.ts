import { CommentDatabaseModel } from './comment.database-model';

describe('Comment', () => {
  it('should create an instance', () => {
    expect(new CommentDatabaseModel()).toBeTruthy();
  });
});
