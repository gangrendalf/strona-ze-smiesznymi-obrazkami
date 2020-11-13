import { UserDatabaseModel } from './user.database-model';

//SHOULD THIS STAFF EVEN EXIST? CONSIDER AND DELETE

xdescribe('UserDatabaseModel', () => {
  it('should create an instance', () => {
    expect(new UserDatabaseModel(null)).toBeTruthy();
  });
});
