import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../service/auth.service';
import { routes } from 'src/app/app-routing.module';
import { LoginComponent } from './login.component';
import { UserLoginData } from '../../model/user-login-data';

class AuthServiceStub {
  login(data: UserLoginData): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        RouterTestingModule,
        FormsModule
       ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
