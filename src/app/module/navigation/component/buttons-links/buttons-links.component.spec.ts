import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsLinksComponent } from './buttons-links.component';

describe('ButtonsLinksComponent', () => {
  let component: ButtonsLinksComponent;
  let fixture: ComponentFixture<ButtonsLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonsLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
