import { TestBed, fakeAsync } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { UnAuthGuard } from './un-auth.guard';

class AuthServiceFake {
  get authState() {
    return null;
  }
};

describe('UnAuthGuard', () => {
  let unauthGuard: UnAuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnAuthGuard,
        { provide: AuthService, useClass: AuthServiceFake}
      ]
    });

    unauthGuard = TestBed.get(UnAuthGuard);
    authService = TestBed.get(AuthService);
  });

  it('should ...', () => {
    expect(unauthGuard).toBeTruthy();
  });

  it(`should resolve false if user authenticated`, fakeAsync(() => {
    spyOnProperty(authService, 'authState').and.returnValue(of({
      isLogged: true
    }))
    
    unauthGuard.canActivate().subscribe(isLogged => {
      expect(isLogged).toBeFalse();
    })
  }));

  it(`should resolve true if user un-authenticated`, fakeAsync(() => {
    spyOnProperty(authService, 'authState').and.returnValue(of({
      isLogged: false
    }))

    unauthGuard.canActivate().subscribe(isLogged => {
      expect(isLogged).toBeTrue();
    })
  }));
});
