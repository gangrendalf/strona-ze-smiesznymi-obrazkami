import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, Observable } from 'rxjs';
import { PaginatorLink } from '../../model/paginator-link';
import { PageService } from '../../service/page.service';

import { PaginatorComponent } from './paginator.component';

class PageServiceStub {
  paginatorLinks$: Observable<PaginatorLink[]> = EMPTY;
}

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ PaginatorComponent ],
      providers: [
        { provide: PageService, useClass: PageServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xdescribe(`(consider template tests; no need to test component)`, () => {
    //
  });
});
