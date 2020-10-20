import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY } from 'rxjs';
import { MemReferenceDatabaseModel } from '../../shared/model/mem-reference.database-model';
import { DatabaseService } from '../../shared/service/database.service';

import { PageService } from './page.service';

class DatabaseServiceStub {
  public memReference: MemReferenceDatabaseModelStub;

  constructor(){
    this.memReference = new MemReferenceDatabaseModelStub();
  }
}

class MemReferenceDatabaseModelStub{
  getAll(){
    return EMPTY
  }
}

describe('PageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule ],
    providers: [
      { provide: DatabaseService, useClass: DatabaseServiceStub }
    ]
  }));

  it('should be created', () => {
    const service: PageService = TestBed.get(PageService);
    expect(service).toBeTruthy();
  });
});
