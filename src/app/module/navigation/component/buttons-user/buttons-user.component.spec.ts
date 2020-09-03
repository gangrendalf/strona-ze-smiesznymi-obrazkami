import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsUserComponent } from './buttons-user.component';

describe('ButtonsUserComponent', () => {
  let component: ButtonsUserComponent;
  let fixture: ComponentFixture<ButtonsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsUserComponent ]
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
