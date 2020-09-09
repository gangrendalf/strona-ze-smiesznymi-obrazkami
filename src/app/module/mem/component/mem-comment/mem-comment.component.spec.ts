import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemCommentComponent } from './mem-comment.component';

describe('MemCommentComponent', () => {
  let component: MemCommentComponent;
  let fixture: ComponentFixture<MemCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
