import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../service/auth.service';
import { routes } from 'src/app/app-routing.module';

import { RemindPasswordComponent } from './remind-password.component';
import { Router } from '@angular/router';

describe('RemindPasswordComponent', () => {
  let component: RemindPasswordComponent;
  let fixture: ComponentFixture<RemindPasswordComponent>;

  let authServiceSpy: { resetPassword: jasmine.Spy };
  let routerSpy: { navigateByUrl: jasmine.Spy };

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ RemindPasswordComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RemindPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.resetPassword() once with given paarameters', () => {
    authServiceSpy.resetPassword.and.returnValue(Promise.resolve());
    const email = 'example@domain.com'

    component.remindPassword(email);

    expect(authServiceSpy.resetPassword).toHaveBeenCalled();
    expect(authServiceSpy.resetPassword).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith(email);
  });

  it('should call router.navigateByUrl with [\'/\'] path on succesfull reset', fakeAsync(() => {
    authServiceSpy.resetPassword.and.returnValue(Promise.resolve());
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));
    const email = 'example@email.com';

    component.remindPassword(email);
    tick();

    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should call router.navigateByUrl with [\'/something-goes-wrong\'] path and error message on failed password reset', fakeAsync(() => {
    const errorMessage = 'testError';
    authServiceSpy.resetPassword.and.returnValue(Promise.reject(errorMessage));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));
    const email = 'example@email.com';

    component.remindPassword(email);
    tick();

    expect(routerSpy.navigateByUrl).toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/something-goes-wrong', { queryParams: {message: errorMessage}});
  }));
});
