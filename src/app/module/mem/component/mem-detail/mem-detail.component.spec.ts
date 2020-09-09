import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemDetailComponent } from './mem-detail.component';

describe('MemDetailComponent', () => {
  let component: MemDetailComponent;
  let fixture: ComponentFixture<MemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
