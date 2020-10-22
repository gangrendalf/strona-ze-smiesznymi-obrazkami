import { Directive, HostListener, Input } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LoginComponent } from './login.component';

//* *************************************************** */
//* **************       PLAYGROUND      ************** */
//* **                                               ** */
//* ** VERIFY LATER IF THOSE TESTS MAKES ANY SENSE!! ** */
//* **                                               ** */
//* *************************************************** */

describe('LoginComponent', () => {
  @Directive({
    selector: '[routerLink]'
  })
  class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    @HostListener('click') onClick() {
      this.navigatedTo = this.linkParams;
    }
  }

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: { login: jasmine.Spy };
  let routerSpy: { navigate: jasmine.Spy };

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ 
        LoginComponent,
        RouterLinkDirectiveStub
       ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents()
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login() once', () => {
    authServiceSpy.login.and.returnValue(Promise.resolve());

    component.login('', '');

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
  });

  it('should call authService.login() with given parameters', () => {
    authServiceSpy.login.and.returnValue(Promise.resolve());

    component.login('givenUser#$%', 'givenPassword&*@');

    expect(authServiceSpy.login).toHaveBeenCalledWith('givenUser#$%', 'givenPassword&*@');
  });

  it('should call router once on succesfull login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(Promise.resolve());
    
    component.login('', '');
    tick();

    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  }));

  it('should call router once on failed login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(Promise.reject());
    
    component.login('', '');
    tick();

    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
  }));

  it('should navigate into home page after successfull login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(Promise.resolve());
    
    component.login('', '');
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should navigate into error page after failed login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(Promise.reject());
    
    component.login('', '');
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/something-goes-wrong']);
  }));

  it('should show required error or touched empty email input', () => {
    const emailDe = fixture.debugElement.query(By.css('input[name=email]'));
    const emailEl: HTMLInputElement = emailDe.nativeElement;

    let errorBoxEl = emailEl.nextElementSibling as HTMLDivElement;

    expect(emailEl.value).toBeFalsy('initialy empty');
    expect(errorBoxEl).toBeNull('initialy not shown');

    emailEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    emailEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    fixture.detectChanges();

    errorBoxEl = emailEl.nextElementSibling as HTMLDivElement;

    expect(emailEl.value).toBe('');
    expect(errorBoxEl).not.toBeNull();
    expect(errorBoxEl.childElementCount).toBeGreaterThan(0);
    expect(errorBoxEl.children[0].textContent).toContain('Pole')
    expect(errorBoxEl.children[0].textContent).toContain('wymagane');
  });

  it('should show required error or touched empty password input', () => {
    const passwordDe = fixture.debugElement.query(By.css('input[name=password]'));
    const passwordEl: HTMLInputElement = passwordDe.nativeElement;

    let errorBoxEl = passwordEl.nextElementSibling as HTMLDivElement;

    expect(passwordEl.value).toBeFalsy('initialy empty');
    expect(errorBoxEl).toBeNull('initialy not shown');

    passwordEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    passwordEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    fixture.detectChanges();

    errorBoxEl = passwordEl.nextElementSibling as HTMLDivElement;

    expect(passwordEl.value).toBe('');
    expect(errorBoxEl).not.toBeNull();
    expect(errorBoxEl.childElementCount).toBeGreaterThan(0);
    expect(errorBoxEl.children[0].textContent).toContain('Pole')
    expect(errorBoxEl.children[0].textContent).toContain('wymagane');
  });

  it('should pass login credentials on button click', () => {
    authServiceSpy.login.and.returnValue(Promise.resolve());

    const emailDe = fixture.debugElement.query(By.css('input[name=email]'));
    const emailEl: HTMLInputElement = emailDe.nativeElement;
    const passwordDe = fixture.debugElement.query(By.css('input[name=password]'));
    const passwordEl: HTMLInputElement = passwordDe.nativeElement;
    const buttonDe = fixture.debugElement.query(By.css('button'));
    const buttonEl: HTMLButtonElement = buttonDe.nativeElement;

    emailEl.value = 'TestName';
    emailEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    passwordEl.value = 'TestPassword';
    passwordEl.dispatchEvent(new Event('input'))
    fixture.detectChanges();

    buttonEl.click();
    fixture.detectChanges();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.login).toHaveBeenCalledWith('TestName', 'TestPassword');
  });

  it('should disable login button when form is empty', () => {
    const buttonDe = fixture.debugElement.query(By.css('button'));
    const buttonEl: HTMLButtonElement = buttonDe.nativeElement;

    expect(buttonEl.disabled).toBe(false);

    fixture.detectChanges();

    expect(buttonEl.disabled).toBe(true);
  });

  it('should enable login button when email and password are provided', () => {
    const emailDe = fixture.debugElement.query(By.css('input[name=email]'));
    const emailEl: HTMLInputElement = emailDe.nativeElement;
    const passwordDe = fixture.debugElement.query(By.css('input[name=password]'));
    const passwordEl: HTMLInputElement = passwordDe.nativeElement;
    const buttonDe = fixture.debugElement.query(By.css('button'));
    const buttonEl: HTMLButtonElement = buttonDe.nativeElement;

    expect(buttonEl.disabled).toBe(false);
    
    fixture.detectChanges();

    expect(buttonEl.disabled).toBe(true);

    emailEl.value = 'testValue1';
    emailEl.dispatchEvent(new Event('input'));
    passwordEl.value = '';
    passwordEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(buttonEl.disabled).toBe(true);

    emailEl.value = '';
    emailEl.dispatchEvent(new Event('input'));
    passwordEl.value = 'testValue2';
    passwordEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(buttonEl.disabled).toBe(true);

    emailEl.value = 'testValue1';
    emailEl.dispatchEvent(new Event('input'));
    passwordEl.value = 'testValue2';
    passwordEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(buttonEl.disabled).toBe(false);
  });

  it('should navigate into /remind-password on button click', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

    const i: number = linkDes.findIndex(de => de.injector.get(RouterLinkDirectiveStub).linkParams == '/remind-password');

    const routerLink = linkDes[i].injector.get(RouterLinkDirectiveStub);
    const buttonEl: HTMLButtonElement = linkDes[i].nativeElement;

    expect(routerLink.linkParams).toBeTruthy();
    expect(buttonEl).toBeTruthy();
    
    buttonEl.click();

    expect(routerLink.navigatedTo).toBe('/remind-password')
  });

  it('should navigate into /register on button click', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));

    const i: number = linkDes.findIndex(de => de.injector.get(RouterLinkDirectiveStub).linkParams == '/register');

    const routerLink = linkDes[i].injector.get(RouterLinkDirectiveStub);
    const buttonEl: HTMLButtonElement = linkDes[i].nativeElement;

    expect(routerLink.linkParams).toBeTruthy();
    expect(buttonEl).toBeTruthy();
    
    buttonEl.click();

    expect(routerLink.navigatedTo).toBe('/register')
  });
})