import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { CategoryDatabaseModel } from './category.database-model';

describe('Category', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    })
 1 })
  it('should create an instance', () => {
    expect(new CategoryDatabaseModel(null)).toBeTruthy();
  });
});
