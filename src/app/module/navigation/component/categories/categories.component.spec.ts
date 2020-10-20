import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, Observable } from 'rxjs';
import { CategoryDatabaseModel } from 'src/app/module/shared/model/category.database-model';
import { Category } from 'src/app/module/shared/model/category.interface';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { CategoryComponent } from './categories.component';

class DatabaseServiceStub{
  category: CategoryDatabaseModelStub;

  constructor(){
    this.category = new CategoryDatabaseModelStub();
  }
}

class CategoryDatabaseModelStub {
  getAll(): Observable<Category[]>{
    return EMPTY;
  }
}

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ CategoryComponent ],
      providers: [
        { provide: DatabaseService, useClass: DatabaseServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
