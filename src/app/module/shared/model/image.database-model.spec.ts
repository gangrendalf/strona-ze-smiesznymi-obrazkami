import { ImageDatabaseModel } from './image.database-model';

//SHOULD THIS STAFF EVEN EXIST? CONSIDER AND DELETE

xdescribe('ImageDatabaseModel', () => {
  it('should create an instance', () => {
    expect(new ImageDatabaseModel(null, null, null)).toBeTruthy();
  });
});
