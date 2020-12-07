import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetail } from 'src/app/module/shared/model/user.interface';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { ProfileActionsComponent } from './profile-actions.component';

@Component({
  selector: 'fa-icon',
  template: `<span>icon</span>`
}) 
class FaIconComponentStub {
  @Input('icon') icon;
}

class DatabaseStub {
  
}

describe('ProfileActionsComponent', () => {
  let component: ProfileActionsComponent;
  let fixture: ComponentFixture<ProfileActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ProfileActionsComponent,
        FaIconComponentStub
      ],
      providers: [
        { provide: DatabaseService, useClass: DatabaseStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileActionsComponent);
    component = fixture.componentInstance;

    component.authUser = { watchedUsers: [] } as UserDetail;
    component.user = { watchedUsers: [] } as UserDetail;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
