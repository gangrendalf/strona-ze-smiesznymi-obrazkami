import { MemDatabaseModel } from './mem.database-model';

describe('Mem', () => {
  it('should create an instance', () => {
    expect(new MemDatabaseModel()).toBeTruthy();
  });
});
