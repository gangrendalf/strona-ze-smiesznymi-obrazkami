import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { RegistrationComponent } from './registration.component';
import { UserRegisterData } from '../../model/user-register-data';
import { DebugElement, Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { not } from '@angular/compiler/src/output/output_ast';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  let authServiceSpy: { registerUser: jasmine.Spy };
  let routerSpy: { navigate: jasmine.Spy };

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registerUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ RegistrationComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy},
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register()  call authService once with given parameters', () => {
    authServiceSpy.registerUser.and.returnValue(Promise.resolve())

    const data: UserRegisterData = {
      nick: 'TestNick',
      email: 'TestEmail',
      password: 'TestPassword',
      birthdate: 123456789 
    };

    component.register(data.nick, data.birthdate, data.email, data.password);

    expect(authServiceSpy.registerUser).toHaveBeenCalled();
    expect(authServiceSpy.registerUser).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.registerUser).toHaveBeenCalledWith(data)
  });

  it('should navigate into main page on successfull regostration', fakeAsync(() => {
    authServiceSpy.registerUser.and.returnValue(Promise.resolve());
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.register('a', 1, 'b', 'c');
    tick();

    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should navigate into error page on failed registration', fakeAsync(() => {
    authServiceSpy.registerUser.and.returnValue(Promise.reject());
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.register('a', 1, 'b', 'c');
    tick();

    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/something-goes-wrong']);
  }));
});

//* ************************************************************************* */

describe('RegistrationComponent (template - nick input)', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  let authServiceSpy: { registerUser: jasmine.Spy };
  let routerSpy: { navigate: jasmine.Spy };

  let inputDe: DebugElement;
  let inputEl: HTMLInputElement;
  let errorBox: HTMLDivElement;

  @Directive({
    selector: '[routerLink}'
  })
  class RouterLinkDirectiveStub{
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    @HostListener('click') onClick() {
      this.navigatedTo = this.linkParams;
    }
  }  

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['registerUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ 
        RegistrationComponent,
        RouterLinkDirectiveStub
       ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy},
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    inputDe = fixture.debugElement.query(By.css('input[name=nick]'));
    inputEl = inputDe.nativeElement;

    errorBox = inputEl.nextElementSibling as HTMLDivElement;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT show any errors initially', () => {
    expect(errorBox).toBeNull('hidden initially');
  })
  
  it('should show required error when input is empty and touched', () => {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox).not.toBeNull('shown after deselect');
    expect(errorBox.childElementCount).toBeGreaterThan(0);
    expect(errorBox.innerText).toContain('nick');
    expect(errorBox.innerText).toContain('wymagane');
  });

  it('should NOT show required error on minLength/pattern error', () => {
    inputEl.value = 'a';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox).not.toBeNull();
    expect(errorBox.childElementCount).toBeGreaterThan(0);
    expect(errorBox.innerText).not.toContain('nick');
    expect(errorBox.innerText).not.toContain('wymagane');

    inputEl.value = '-';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;
    expect(errorBox).not.toBeNull();

    expect(errorBox.childElementCount).toBeGreaterThan(0);
    expect(errorBox.innerText).not.toContain('nick');
    expect(errorBox.innerText).not.toContain('wymagane');
  });

  it('should show minLength error when less than 3 chars', () => {
    inputEl.value = 'a';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox).not.toBeNull();
    expect(errorBox.innerText).toContain('minimum');
    expect(errorBox.innerText).toContain(inputEl.minLength.toString());
    expect(errorBox.innerText).toContain('znaki');

    inputEl.value = 'ab';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(errorBox).not.toBeNull();
    expect(errorBox.innerText).toContain('minimum');
    expect(errorBox.innerText).toContain(inputEl.minLength.toString());
    expect(errorBox.innerText).toContain('znaki');
  });

  it('should NOT show minLength error on required/pattern error', () => {
    //minLength = 3
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox).not.toBeNull();
    expect(errorBox.innerText).not.toContain('minimum');
    expect(errorBox.innerText).not.toContain(inputEl.minLength.toString());

    inputEl.value = '_abc';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(errorBox).not.toBeNull();
    expect(errorBox.innerText).not.toContain('minimum');
    expect(errorBox.innerText).not.toContain(inputEl.minLength.toString());
  });

  it('should show pattern error', () => {
    //NICK have to start with number or digit and CAN contain '-', '_' marks
    inputEl.value = '_';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox).not.toBeNull();
    expect(errorBox.innerText).toContain('Nick musi zaczynać się literą bądź liczbą oraz może zawierać znaki - _');

    inputEl.value = '-';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox).not.toBeNull();
    expect(errorBox.innerText).toContain('Nick musi zaczynać się literą bądź liczbą oraz może zawierać znaki - _');
  });

  it('should NOT show pattern error on required/minLength error', () => {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox.innerText).not.toContain('Nick musi zaczynać się literą bądź liczbą oraz może zawierać znaki - _');

    inputEl.value = 'a';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    errorBox = inputEl.nextElementSibling as HTMLDivElement;

    expect(errorBox.innerText).not.toContain('Nick musi zaczynać się literą bądź liczbą oraz może zawierać znaki - _');
  })
})
