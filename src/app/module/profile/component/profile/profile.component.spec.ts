import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';

import { ProfileComponent } from './profile.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/module/authentication/service/auth.service';

class AngularFireStoreStub {

}

class AngularFireStorageStub {

}

class AuthServiceStub{

}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FontAwesomeModule,
        RouterTestingModule.withRoutes([]),
        HttpClientModule
      ],
      declarations: [ 
        ProfileComponent
      ],
      providers: [
        { provide: AngularFirestore, useClass: AngularFireStoreStub },
        { provide: AngularFireStorage, useClass: AngularFireStorageStub },
        { provide: AuthService, useClass: AuthServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
