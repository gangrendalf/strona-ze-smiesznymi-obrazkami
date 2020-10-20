import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EMPTY, Observable } from 'rxjs';
import { AuthState } from 'src/app/module/authentication/model/auth-state';
import { AuthService } from 'src/app/module/authentication/service/auth.service';

import { UserMenuComponent } from './user-menu.component';

class AuthServiceStub {
  authState: Observable<AuthState> = EMPTY;

  logout(): Promise<boolean>{
    return Promise.resolve(false);
  }
}

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        RouterTestingModule,
        FontAwesomeModule
       ],
      declarations: [ UserMenuComponent ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
