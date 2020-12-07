import { Directive, HostListener, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSectionsComponent } from './profile-sections.component';

@Directive({selector: '[routerLink]'})
class RouterLinkStub{
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click') onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('ProfileSectionsComponent', () => {
  let component: ProfileSectionsComponent;
  let fixture: ComponentFixture<ProfileSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProfileSectionsComponent,
        RouterLinkStub
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
