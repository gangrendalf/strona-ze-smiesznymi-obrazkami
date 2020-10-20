import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, EMPTY } from 'rxjs';
import { MemReference } from 'src/app/module/shared/model/mem-reference.interface';
import { PageService } from '../../service/page.service';

import { MemsSetComponent } from './mems-set.component';

class PageServiceStub {
  activePageMemCollection$: Observable<MemReference[]> = EMPTY;
}

describe('MemsSetComponent', () => {
  let component: MemsSetComponent;
  let fixture: ComponentFixture<MemsSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemsSetComponent ],
      providers: [
        { provide: PageService, useClass: PageServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemsSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
