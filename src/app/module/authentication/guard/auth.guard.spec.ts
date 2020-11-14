import { fakeAsync, TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from './auth.guard';

class AuthServiceFake {
  get authState() {
    return null;
  }
};

describe('AuthGuardGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: AuthServiceFake }
      ]
    });

    authGuard = TestBed.get(AuthGuard);
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(authGuard).toBeTruthy();
  });

  it(`should resolve true if user authenticated`, fakeAsync(() => {
    spyOnProperty(authService, 'authState').and.returnValue(of({
      isLogged: true
    }))
    
    expectAsync(authGuard.canActivate()).toBeResolvedTo(true);
  }));

  it(`should resolve false if user un-authenticated`, fakeAsync(() => {
    spyOnProperty(authService, 'authState').and.returnValue(of({
      isLogged: false
    }))
    
    expectAsync(authGuard.canActivate()).toBeResolvedTo(false);
  }));
});
