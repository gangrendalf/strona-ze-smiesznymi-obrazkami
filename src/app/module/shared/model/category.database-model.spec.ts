import { CategoryDatabaseModel } from './category.database-model';

describe('Category', () => {
  it('should create an instance', () => {
    expect(new CategoryDatabaseModel()).toBeTruthy();
  });
});
