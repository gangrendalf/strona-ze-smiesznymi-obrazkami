import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, Observable } from 'rxjs';
import { AuthState } from 'src/app/module/authentication/model/auth-state';
import { AuthService } from 'src/app/module/authentication/service/auth.service';

import { ButtonsUserComponent } from './user-specific.component';

class AuthServiceStub{
  authState: Observable<AuthState> = EMPTY;
}

describe('ButtonsUserComponent', () => {
  let component: ButtonsUserComponent;
  let fixture: ComponentFixture<ButtonsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ ButtonsUserComponent ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
