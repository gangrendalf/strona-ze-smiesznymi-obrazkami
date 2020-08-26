import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemsSetComponent } from './mems-set.component';

describe('MemsSetComponent', () => {
  let component: MemsSetComponent;
  let fixture: ComponentFixture<MemsSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemsSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemsSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
