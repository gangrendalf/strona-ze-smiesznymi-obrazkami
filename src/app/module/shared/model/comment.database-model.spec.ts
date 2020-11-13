import { CommentDatabaseModel } from './comment.database-model';

//SHOULD THIS STAFF EVEN EXIST? CONSIDER AND DELETE

xdescribe('CommentDatabaseModel', () => {
  it('should create an instance', () => {
    expect(new CommentDatabaseModel(null)).toBeTruthy();
  });
});
