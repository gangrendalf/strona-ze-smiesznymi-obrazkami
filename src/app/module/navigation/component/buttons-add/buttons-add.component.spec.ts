import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsAddComponent } from './buttons-add.component';

describe('ButtonsAddComponent', () => {
  let component: ButtonsAddComponent;
  let fixture: ComponentFixture<ButtonsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
