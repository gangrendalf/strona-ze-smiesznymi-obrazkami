import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EMPTY, Observable } from 'rxjs';
import { AuthState } from 'src/app/module/authentication/model/auth-state';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { Category } from 'src/app/module/shared/model/category.interface';
import { ImageMetadata } from 'src/app/module/shared/model/image-metadata.interface';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { Mem } from 'src/app/module/shared/model/mem.interface';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { MemAddFormComponent } from './mem-add-form.component';

class DatabaseServiceStub {
  public category: CategoryDatabaseModelStub;
  public mem: MemDatabaseModelStub;
  public memReference: MemReferenceDatabaseModelStub;
  public image: ImageDatabaseModelStub;

  constructor() { 
    this.category = new CategoryDatabaseModelStub();
    this.memReference = new MemReferenceDatabaseModelStub();
    this.mem = new MemDatabaseModelStub();
    this.image = new ImageDatabaseModelStub();
  }
}

class CategoryDatabaseModelStub {
  getAll(): Observable<Category[]> {
    return EMPTY;
  }
}

class MemReferenceDatabaseModelStub {
  set(data: MemReference): Promise<void>{
    return Promise.resolve();
  }
}

class MemDatabaseModelStub {
  set(data: Mem): Promise<Mem>{
    return Promise.resolve({} as Mem);
  }
}

class ImageDatabaseModelStub {
  set(data: ImageMetadata): Promise<ImageMetadata>{
    return Promise.resolve({} as ImageMetadata);
  }
}

class AuthServiceStub {
  authState: Observable<AuthState> = EMPTY;
}

describe('MemAddFormComponent', () => {
  let component: MemAddFormComponent;
  let fixture: ComponentFixture<MemAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        FormsModule
      ],
      declarations: [ 
        MemAddFormComponent 
      ],
      providers: [
        { provide: DatabaseService, useClass: DatabaseServiceStub },
        { provide: AuthService, useClass: AuthServiceStub }
        
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
