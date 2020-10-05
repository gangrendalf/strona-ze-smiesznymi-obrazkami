import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SomethingGoesWrongComponent } from './something-goes-wrong.component';

describe('SomethingGoesWrongComponent', () => {
  let component: SomethingGoesWrongComponent;
  let fixture: ComponentFixture<SomethingGoesWrongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SomethingGoesWrongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomethingGoesWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
