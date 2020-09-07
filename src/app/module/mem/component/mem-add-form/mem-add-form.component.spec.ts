import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemAddFormComponent } from './mem-add-form.component';

describe('MemAddFormComponent', () => {
  let component: MemAddFormComponent;
  let fixture: ComponentFixture<MemAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
