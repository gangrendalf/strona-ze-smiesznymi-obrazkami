import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { MemCommentInputComponent } from '../mem-comment-input/mem-comment-input.component';

import { MemCommentComponent } from './mem-comment.component';

class DatabaseServiceStub {
  public comment: CommentDatabaseModelStub;

  constructor() { 
    this.comment = new CommentDatabaseModelStub();
  }
}

class CommentDatabaseModelStub {
  update(data: Comment, commentID: string): Promise<void> {
    return Promise.resolve();
  }

  set(data: Comment, memid: string): Promise<void> {
    return Promise.resolve();
  }
}

describe('MemCommentComponent', () => {
  let component: MemCommentComponent;
  let fixture: ComponentFixture<MemCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        FontAwesomeModule,
        FormsModule
       ], 
      declarations: [ 
        MemCommentComponent,
        MemCommentInputComponent
       ],
      providers: [ {provide: DatabaseService, useClass: DatabaseServiceStub} ]
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
