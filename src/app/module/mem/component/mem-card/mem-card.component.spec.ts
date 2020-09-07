import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemCardComponent } from './mem-card.component';

describe('MemCardComponent', () => {
  let component: MemCardComponent;
  let fixture: ComponentFixture<MemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
