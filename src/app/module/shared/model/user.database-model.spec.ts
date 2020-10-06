import { UserDatabaseModel } from './user.database-model';

describe('User', () => {
  it('should create an instance', () => {
    expect(new UserDatabaseModel()).toBeTruthy();
  });
});
