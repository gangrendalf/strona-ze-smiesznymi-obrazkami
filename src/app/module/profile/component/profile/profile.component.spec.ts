import { async, ComponentFixture, fakeAsync, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ProfileComponent } from './profile.component';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { Directive, HostListener, Input, ViewChild } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { AuthState } from 'src/app/module/authentication/model/auth-state';
import { UserDetail } from 'src/app/module/shared/model/user.interface';

@Directive({ selector: "[routerLink]" })
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click') onClick() {
    this.navigatedTo = this.linkParams;
  }
};

@Directive({ selector: 'router-outlet'})
class RouterOutletStub {
  //
}

function getTestFile(fileName: string){
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    image.onload = function() {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
      canvas.toBlob(blob => {
        const file = new File([blob], `${fileName}.png`, {type: 'image/png'});
        resolve(file);
      });
    };
  
    image.src = `./test-assets/${fileName}.png`;
  })
  
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const testUser: UserDetail = {
    uid: 'testId123',
    nick: 'testUser',
    email: 'example@email.com',
    birthdate: Date.now(),
    isAdmin: false,
    isModerator: false,
    profileImageMetadata: null,
    backgroundImageMetadata: null,
    addedComments: 0,
    addedMems: 0,
    summaryDownvotes: 0,
    summaryUpvotes: 0,
    watchedTags: null,
    watchedUsers: null
  }

  let routeStub = {
    snapshot: { paramMap: { get: function (name) { return testUser.uid } } }
  };
  let routerStub = {
    events: of<NavigationEnd>(new NavigationEnd(1, '', ''))
  };
  let authServiceStub = {
    authState: of<AuthState>({isLogged: true, user: { ...testUser }})
  };
  let databaseServiceStub = {
    user: { getSingle: function(uid) {return of(testUser); } }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FontAwesomeModule
      ],
      declarations: [ 
        ProfileComponent,
        RouterLinkDirectiveStub,
        RouterOutletStub
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: DatabaseService, useValue: databaseServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`triggerSelectDialog()`, () => {
    it(`should trigger click event on input element`, fakeAsync(() => {
      const inputElement = document.createElement('input');
      
      inputElement.onclick = (e) => {
        expect(e).toBeDefined();
      }

      component.triggerSelectDialog(inputElement);
      tick();
    }));
  });

  describe(`loadProfileFile()`, () => {
    it(`should append selected image into HMTL template without errors`, async() => {
      const file = await getTestFile('profile-correct');
      const event = { target: { files: [file] } };

      expect(event.target.files.length).toEqual(1, 'test file avaible');

      await component.loadProfileFile(event); 

      const imgHolderDE = fixture.debugElement.nativeElement.querySelector('.profile-image img');
      expect(imgHolderDE).not.toBeNull();
      expect(component.imageLoadingFail).toBeNull();

    });

    it(`should append error on image loader fail`, async() => {
      const wrongFile = { wrongData: 'im even not a file' };
      const event = { target: { files: [wrongFile] }};

      await component.loadProfileFile(event);
      
      const error = component.imageLoadingFail;

      expect(error).not.toBeNull();
    });

    it(`should show 'save' and 'cancel' buttons`, async() => {
      const buttonsContainer = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.actions');
      const file = await getTestFile('profile-correct');
      const event = { target: { files: [file] } };

      expect(event.target.files.length).toEqual(1, 'test file avaible');
      expect(buttonsContainer.hidden).toEqual(true);

      await component.loadProfileFile(event); 
      fixture.detectChanges();


      expect(buttonsContainer.hidden).toEqual(false);
    })
  });
});
