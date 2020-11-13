import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let firestoreStub = { };
  let firestorageStub = { };
  let httpStub = { };

  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        { provide: AngularFirestore, useValue: firestoreStub },
        { provide: AngularFireStorage, useValue: firestorageStub },
        { provide: HttpClient, useValue: httpStub }
      ]
    });

    service = TestBed.get(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
