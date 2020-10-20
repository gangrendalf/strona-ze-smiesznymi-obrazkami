import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { EMPTY, Observable } from 'rxjs';
import { UserDatabaseModel } from '../../shared/model/user.database-model';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';

import { AuthService } from './auth.service';

class AngularFireAuthStub {
  authState: Observable<firebase.User> = EMPTY;
}

class AuthStub {
  createUserWithEmailAndPassword(email: string, password: string): Promise<Object> {
    return Promise.resolve({})
  }

  sendPasswordResetEmail(email: string): Promise<void> {
    return Promise.resolve();
  }

  signInWithEmailAndPassword(email: string, password: string): Promise<Object> {
    return Promise.resolve({})
  }

  signOut(): Promise<void> {
    return Promise.resolve();
  }
}

class DatabaseServiceStub {
  user: UserDatabaseModelStub;

  constructor(){
    this.user = new UserDatabaseModelStub();
  }
}

class UserDatabaseModelStub {
  getSingle(uid: string){
    return EMPTY;
  }

  set(data: UserDetail): Promise<void>{
    return Promise.resolve();
  }
}

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthService,
      { provide: AngularFireAuth, useClass: AngularFireAuthStub },
      { provide: DatabaseService, useClass: DatabaseServiceStub }
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

});
