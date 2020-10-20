import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { database } from 'firebase';
import { EMPTY, Observable } from 'rxjs';
import { AuthState } from 'src/app/module/authentication/model/auth-state';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { MemReferenceDatabaseModel } from 'src/app/module/shared/model/mem-reference.database-model';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { MemDatabaseModel } from 'src/app/module/shared/model/mem.database-model';
import { Mem } from 'src/app/module/shared/model/mem.interface';
import { DatabaseService } from 'src/app/module/shared/service/database.service';

import { MemCardComponent } from './mem-card.component';

class DatabaseServiceStub {
  mem: MemDatabaseModelStub;
  memReference: MemReferenceDatabaseModelStub;

  constructor(){
    this.mem = new MemDatabaseModelStub();
    this.memReference = new MemReferenceDatabaseModelStub();
  }
}

class MemDatabaseModelStub {
  getSingle(id: string): Observable<MemReference> {
    return EMPTY
  }

  update(data: Mem, id: string): Promise<void> {
    return Promise.resolve();
  }
}

class MemReferenceDatabaseModelStub {
  update(data: Mem, id: string): Promise<void> {
    return Promise.resolve();
  }
}

class AuthServiceStub {
  authState: Observable<AuthState> = EMPTY;
}

describe('MemCardComponent', () => {
  let component: MemCardComponent;
  let fixture: ComponentFixture<MemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FontAwesomeModule
      ],
      declarations: [ MemCardComponent ],
      providers: [
        { provide: DatabaseService, useClass: DatabaseServiceStub },
        { provide: AuthService, useClass: AuthServiceStub }
      ]
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
