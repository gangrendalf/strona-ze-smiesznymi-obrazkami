import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchedMemsComponent } from './watched-mems.component';

describe('WatchedMemsComponent', () => {
  let component: WatchedMemsComponent;
  let fixture: ComponentFixture<WatchedMemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchedMemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchedMemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
