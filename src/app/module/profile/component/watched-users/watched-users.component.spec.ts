import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchedUsersComponent } from './watched-users.component';

describe('WatchedUsersComponent', () => {
  let component: WatchedUsersComponent;
  let fixture: ComponentFixture<WatchedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
