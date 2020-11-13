import { MemDatabaseModel } from './mem.database-model';

//SHOULD THIS STAFF EVEN EXIST? CONSIDER AND DELETE

xdescribe('MemDatabaseModel', () => {
  it('should create an instance', () => {
    expect(new MemDatabaseModel(null)).toBeTruthy();
  });
});
