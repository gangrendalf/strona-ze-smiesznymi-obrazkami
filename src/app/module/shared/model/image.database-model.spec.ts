import { ImageDatabaseModel } from './image.database-model';

describe('Image.DatabaseModel', () => {
  it('should create an instance', () => {
    expect(new ImageDatabaseModel(null, null, null)).toBeTruthy();
  });
});
