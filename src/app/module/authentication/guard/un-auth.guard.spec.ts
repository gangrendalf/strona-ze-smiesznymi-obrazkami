import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, Observable } from 'rxjs';
import { routes } from 'src/app/app-routing.module';
import { AuthState } from '../model/auth-state';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from './auth.guard';

import { UnAuthGuard } from './un-auth.guard';

class AuthServiceStub {
  authState: Observable<AuthState> = EMPTY;
}

describe('UnAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        UnAuthGuard,
        { provide: AuthService, useClass: AuthServiceStub}
      ]
    });
  });

  it('should ...', inject([UnAuthGuard], (guard: UnAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
