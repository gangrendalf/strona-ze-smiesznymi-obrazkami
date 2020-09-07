import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesSetComponent } from './movies-set.component';

describe('MoviesSetComponent', () => {
  let component: MoviesSetComponent;
  let fixture: ComponentFixture<MoviesSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoviesSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
