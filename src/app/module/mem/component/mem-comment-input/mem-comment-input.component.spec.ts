import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemCommentInputComponent } from './mem-comment-input.component';

describe('MemCommentInputComponent', () => {
  let component: MemCommentInputComponent;
  let fixture: ComponentFixture<MemCommentInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemCommentInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemCommentInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
