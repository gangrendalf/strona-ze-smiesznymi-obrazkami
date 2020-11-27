import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSectionsComponent } from './profile-sections.component';

describe('ProfileSectionsComponent', () => {
  let component: ProfileSectionsComponent;
  let fixture: ComponentFixture<ProfileSectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSectionsComponent ]
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
