import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { DatabaseService } from './database.service';

class AngularFirestoreStub {

}

class AngularFireStorageStub {

}

describe('DatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ],
    providers: [
      { provide: AngularFirestore, useClass: AngularFirestoreStub },
      { provide: AngularFireStorage, useClass: AngularFireStorageStub }
    ]
  }));

  it('should be created', () => {
    const service: DatabaseService = TestBed.get(DatabaseService);
    expect(service).toBeTruthy();
  });
});
