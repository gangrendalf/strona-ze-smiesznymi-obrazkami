import { fakeAsync, TestBed, tick } from "@angular/core/testing"
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, Subject } from 'rxjs';
import { UserDetail } from '../../shared/model/user.interface';
import { DatabaseService } from '../../shared/service/database.service';
import { UserRegisterData } from '../model/user-register-data';
import { AuthService } from './auth.service'

describe(`AuthService`, () => {
  let service: AuthService;
  let fireAuthService: AngularFireAuth;
  let databaseService: DatabaseService;
  
  let fireAuthStub: {
    authState: Observable<any>,
    auth: {
      createUserWithEmailAndPassword: Function,
      signInWithEmailAndPassword: Function,
      signOut: Function,
      sendPasswordResetEmail: Function
    }
  };
  let databaseStub: {
    user: {
      getSingle: Function,
      update: Function
    }
  };

  let authState$ = new Subject();

  beforeEach(() => {
    fireAuthStub = {
      authState: authState$.asObservable(),
      auth: {
        createUserWithEmailAndPassword: function (email, password): any { },
        signInWithEmailAndPassword: function (email, password): any { },
        signOut: function (): any { },
        sendPasswordResetEmail: function (email): any { }
      }
    }

    databaseStub = {
      user: {
        getSingle:  function() {
          return of({
            nick: 'testNick',
            isAdmin: false,
            isModerator: false
          } as UserDetail)
        },
        update: function (): any { }
      }
    }

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: fireAuthStub },
        { provide: DatabaseService, useValue: databaseStub }
      ]
    });

    service = TestBed.get(AuthService);
    fireAuthService = TestBed.get(AngularFireAuth);
    databaseService = TestBed.get(DatabaseService);
  });

  it(`should create`, () => {
    expect(service).toBeTruthy();
  });


  describe(`authState`, () => {
    let subscription;

    afterEach(() => {
      if(subscription)
        subscription.unsubscribe();
    })

    it(`should update for UNAUTH user`, (done) => {
      authState$.next(null as firebase.User);
  
      subscription = service.authState.subscribe(authState => {
        expect(authState.isLogged).toBeFalsy();
        expect(authState.user).toBeUndefined();
        done();
      });
      
    });
  
    it(`should update for AUTH user`, (done) => {
      authState$.next({uid: 'testID123'} as firebase.User);
  
      subscription = service.authState.subscribe(authState => {
        expect(authState.isLogged).toBeTruthy();
        expect(authState.user).toBeDefined();
        expect(authState.user).toEqual({
          nick: 'testNick',
          isAdmin: false,
          isModerator: false,
          uid: 'testID123'
        })
        done();
      });
    });
      
  })

  describe(`registerUser()`, () => {
    const registerData: UserRegisterData = {
      birthdate: 9999999,
      email: 'email@domain.com',
      nick: 'testNick123',
      password: 'testPass123'
    };

    const uid = 'uid123';

    const userData: UserDetail = {
      uid: uid,
      nick: registerData.nick,
      email: registerData.email,
      birthdate: registerData.birthdate,
      addedMems: 0,
      addedComments: 0,
      summaryDownvotes: 0,
      summaryUpvotes: 0,
      watchedTags: null,
      watchedUsers: 0,
      isModerator: false,
      isAdmin: false,
      profileImageMetadata: null,
      backgroundImageMetadata: null  
    };

    it(`should register user`, fakeAsync(() => {
      fireAuthService.auth.createUserWithEmailAndPassword = jasmine.createSpy('createUserWithEmailAndPassword').and.resolveTo( { user: { uid: uid } });
  
      databaseService.user.set = jasmine.createSpy('set').and.resolveTo();
      
      expectAsync(service.registerUser(registerData)).toBeResolved();
      expect(fireAuthService.auth.createUserWithEmailAndPassword).toHaveBeenCalledOnceWith(registerData.email, registerData.password);
      tick();
      expect(databaseService.user.set).toHaveBeenCalledOnceWith(userData);
    }));
  
    it(`should reject with specific message on fireauth rejection`, fakeAsync(() => {
      fireAuthService.auth.createUserWithEmailAndPassword = 
        jasmine.createSpy('createUserWithEmailAndPassword').and.rejectWith('Example rejection message');
  
      databaseService.user.set = 
        jasmine.createSpy('set').and.resolveTo();
      
      expectAsync(service.registerUser(registerData)).toBeRejectedWith('AuthService Error: registerUser() - firebase rejection'); 
      expect(fireAuthService.auth.createUserWithEmailAndPassword).toHaveBeenCalledOnceWith(registerData.email, registerData.password);
      tick();
      expect(databaseService.user.set).not.toHaveBeenCalled();
    }));

    it(`should reject with specific message on firestore rejection`, fakeAsync(() => {
      fireAuthService.auth.createUserWithEmailAndPassword = jasmine.createSpy('createUserWithEmailAndPassword').and.resolveTo( { user: { uid: uid } });
  
      databaseService.user.set = 
        jasmine.createSpy('set').and.rejectWith('Example rejection message')
      
      expectAsync(service.registerUser(registerData)).toBeRejectedWith('AuthService Error: registerUser() - firebase rejection'); 
      expect(fireAuthService.auth.createUserWithEmailAndPassword).toHaveBeenCalledOnceWith(registerData.email, registerData.password);
      tick();
      expect(databaseService.user.set).toHaveBeenCalledOnceWith(userData);
    }));

    it(`should reject with specific message on fireauth error`, fakeAsync(() => {
      fireAuthService.auth.createUserWithEmailAndPassword = jasmine.createSpy('createUserWithEmailAndPassword').and.throwError('Example error message')
  
      databaseService.user.set = jasmine.createSpy('set').and.resolveTo();

      expectAsync(service.registerUser(registerData)).toBeRejectedWith('AuthService Error: registerUser() - general error');
      expect(fireAuthService.auth.createUserWithEmailAndPassword).toHaveBeenCalledOnceWith(registerData.email, registerData.password);
      tick();
      expect(databaseService.user.set).not.toHaveBeenCalled();
    }));

    it(`should reject with specific message on firestore error`, fakeAsync(() => {
      fireAuthService.auth.createUserWithEmailAndPassword = jasmine.createSpy('createUserWithEmailAndPassword').and.resolveTo( { user: { uid: uid } });
  
      databaseService.user.set = jasmine.createSpy('set').and.throwError('Example error message')

      expectAsync(service.registerUser(registerData)).toBeRejectedWith('AuthService Error: registerUser() - general error');
      expect(fireAuthService.auth.createUserWithEmailAndPassword).toHaveBeenCalledOnceWith(registerData.email, registerData.password);
      tick();
      expect(databaseService.user.set).toHaveBeenCalledOnceWith(userData);
    }))
  });

  describe(`resetPassword()`, () => {
    const email: string = 'example@domain.com';

    it(`should send password reset email`, fakeAsync(() => {
      fireAuthService.auth.sendPasswordResetEmail = jasmine.createSpy('sendPasswordResetEmail').and.resolveTo();

      expectAsync(service.resetPassword(email)).toBeResolved();
      expect(fireAuthService.auth.sendPasswordResetEmail).toHaveBeenCalledOnceWith(email)
    }));

    it(`should reject with specific message on fireauth reject`, fakeAsync(() => {
      fireAuthService.auth.sendPasswordResetEmail = jasmine.createSpy('sendPasswordResetEmail').and.rejectWith('Example rejection message');

      expectAsync(service.resetPassword(email)).toBeRejectedWith('AuthService Error: resetPassword() - fireAuth rejection');
      expect(fireAuthService.auth.sendPasswordResetEmail).toHaveBeenCalledOnceWith(email)
    }));

    it(`should reject with specific message on error`, fakeAsync(() => {
      fireAuthService.auth.sendPasswordResetEmail = jasmine.createSpy('sendPasswordResetEmail').and.throwError(Error('Example error message'));

      expectAsync(service.resetPassword(email)).toBeRejectedWith('AuthService Error: resetPassword() - general error');
      expect(fireAuthService.auth.sendPasswordResetEmail).toHaveBeenCalledOnceWith(email)
    }));
  });

  describe(`login()`, () => {
    const email: string = 'exmaple@domain.com';
    const password: string = 'examplePassword123';

    it('should log in', fakeAsync(() => {
      fireAuthService.auth.signInWithEmailAndPassword = jasmine.createSpy('signIn').and.resolveTo();

      expectAsync(service.login(email, password)).toBeResolved();
      expect(fireAuthService.auth.signInWithEmailAndPassword).toHaveBeenCalledOnceWith(email, password);
    }));

    it('should reject with specific message on fireauth reject', fakeAsync(() => {
      fireAuthService.auth.signInWithEmailAndPassword = jasmine.createSpy('signIn').and.rejectWith('Example rejection message');

      expectAsync(service.login(email, password)).toBeRejectedWith('AuthService Error: login() - fireAuth rejection');
      expect(fireAuthService.auth.signInWithEmailAndPassword).toHaveBeenCalledOnceWith(email, password);
    }));

    it(`should reject with specific message on error`, fakeAsync(() => {
      fireAuthService.auth.signInWithEmailAndPassword = jasmine.createSpy('signIn').and.throwError(Error('Example error message'));

      expectAsync(service.login(email, password)).toBeRejectedWith('AuthService Error: login() - general error');
      expect(fireAuthService.auth.signInWithEmailAndPassword).toHaveBeenCalledOnceWith(email, password);
    }))
  });

  describe(`logout()`, () => {
    it(`should log out`, fakeAsync(() => {
      fireAuthService.auth.signOut = jasmine.createSpy('signOut').and.resolveTo();

      expectAsync(service.logout()).toBeResolved();
      expect(fireAuthService.auth.signOut).toHaveBeenCalledTimes(1);
    }));

    it(`should reject with specific message on fireauth reject`, fakeAsync(() => {
      fireAuthService.auth.signOut = jasmine.createSpy('signOut').and.rejectWith('Example rejection message');

      expectAsync(service.logout()).toBeRejectedWith('AuthService Error: logout() - fireAuth rejection');
      expect(fireAuthService.auth.signOut).toHaveBeenCalledTimes(1);
    }));

    it(`should reject with specific message on error`, fakeAsync(() => {
      fireAuthService.auth.signOut = jasmine.createSpy('signOut').and.throwError(Error('Example error message'))

      expectAsync(service.logout()).toBeRejectedWith('AuthService Error: logout() - general error');
      expect(fireAuthService.auth.signOut).toHaveBeenCalledTimes(1);
    }));
  })
})