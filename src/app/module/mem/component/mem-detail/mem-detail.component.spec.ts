import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, Observable } from 'rxjs';
import { AuthState } from 'src/app/module/authentication/model/auth-state';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { SomethingGoesWrongComponent } from 'src/app/module/shared/component/something-goes-wrong/something-goes-wrong.component';
import { DatabaseService } from 'src/app/module/shared/service/database.service';
import { SharedModule } from 'src/app/module/shared/shared.module';

import { MemDetailComponent } from './mem-detail.component';

class DatabaseServiceStub {
  comment: CommentDatabaseModelStub;

  constructor(){
    this.comment = new CommentDatabaseModelStub();
  }
}

class CommentDatabaseModelStub {
  getAll(id: string): Observable<Comment[]>{
    return EMPTY;
  }

  set(data: Comment, parentID: string): Promise<void>{
    return Promise.resolve();
  }
}

class AuthServiceStub {
  authState: Observable<AuthState> = EMPTY;
}

xdescribe('MemDetailComponent', () => {
  let component: MemDetailComponent;
  let fixture: ComponentFixture<MemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, 
        RouterTestingModule.withRoutes([
          { path: 'something-goes-wrong', component: SomethingGoesWrongComponent }
        ])],
      declarations: [ 
        MemDetailComponent
       ],
       providers: [
        { provide: DatabaseService, useClass: DatabaseServiceStub },
        { provide: AuthService, useClass: AuthServiceStub }
       ],
       schemas: [NO_ERRORS_SCHEMA]
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
