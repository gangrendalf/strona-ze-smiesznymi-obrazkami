import { MemReferenceDatabaseModel } from './mem-reference.database-model';

//SHOULD THIS STAFF EVEN EXIST? CONSIDER AND DELETE

xdescribe('MemReferenceDatabaseModel', () => {
  it('should create an instance', () => {
    expect(new MemReferenceDatabaseModel(null)).toBeTruthy();
  });
});
