import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, NavigationEnd, ParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { faChessKing } from '@fortawesome/free-solid-svg-icons';
import { doesNotThrow } from 'assert';
import { url } from 'inspector';
import { EMPTY, Observable, of, Subject, Subscription } from 'rxjs';
import { MemReferenceDatabaseModel } from '../../shared/model/mem-reference.database-model';
import { MemReference } from '../../shared/model/mem-reference.interface';
import { DatabaseService } from '../../shared/service/database.service';
import { PaginatorLink } from '../model/paginator-link';

import { PageService } from './page.service';

describe('PageService', () => {
  let service: PageService;

  let queryParamMap$: Subject<ParamMap>;
  let routerEvents$: Subject<any>;
  let memCollection$: Subject<MemReference[]>

  let subscription: Subscription;
  
  let databaseStub: {
    memReference: {
      getAll: Function
    }
  };

  let routerStub: {
    events: Observable<Event>,
    url: string
  }

  let activatedRouteStub: {
    queryParamMap: Observable<ParamMap>
  }

  const testMem11: MemReference = {
    approvalDate: 111, approved: true, authorID: 'author1', category: 'category1', creationDate: 111, imageID: 'image1', itemID: 'item1', tags: ['tag1']
  };

  const testMem12: MemReference = {
    approvalDate: 222, approved: true, authorID: 'author2', category: 'category2', creationDate: 222, imageID: 'image2', itemID: 'item2', tags: ['tag2']
  };

  const testMem13: MemReference = {
    approvalDate: 333, approved: false, authorID: 'author3', category: 'category3', creationDate: 333, imageID: 'image3', itemID: 'item3', tags: ['tag3']
  };

  const testMem21: MemReference = {
    approvalDate: 444, approved: true, authorID: 'author3', category: 'category3', creationDate: 444, imageID: 'image4', itemID: 'item4', tags: ['tag1', 'tag2']
  };

  const testMem22: MemReference = {
    approvalDate: 555, approved: true, authorID: 'author2', category: 'category2', creationDate: 555, imageID: 'image5', itemID: 'item5', tags: ['tag2', 'tag3']
  };

  const testMem23: MemReference = {
    approvalDate: 666, approved: true, authorID: 'author1', category: 'category1', creationDate: 666, imageID: 'image6', itemID: 'item6', tags: ['tag3', 'tag1']
  };

  const memCollectionOnePage: MemReference[] = [testMem11, testMem12, testMem13];
  const memCollectionTwoPages: MemReference[] =[testMem11, testMem12, testMem13, testMem21, testMem22, testMem23];

  beforeEach(() =>{
    queryParamMap$ = new Subject<ParamMap>();
    routerEvents$ = new Subject<any>();
    memCollection$ = new Subject<MemReference[]>();

    databaseStub = {
      memReference: {
        getAll: function () {
          return memCollection$.asObservable();
        }
      }
    };

    activatedRouteStub = {
      queryParamMap: queryParamMap$.asObservable()
    };

    routerStub = {
      events: routerEvents$.asObservable(),
      url: 'testURL'
    }

    TestBed.configureTestingModule({
      providers: [
        PageService,
        { provide: DatabaseService, useValue: databaseStub },
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    });

    service = TestBed.get(PageService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    if(subscription)
      subscription.unsubscribe();

    queryParamMap$.complete();
    routerEvents$.complete();
    memCollection$.complete();
  })


  describe(`activePageMemCollection (one page)`, () => {
    beforeEach(() => {
      queryParamMap$.next(convertToParamMap({}));
      memCollection$.next(memCollectionOnePage);
    });

    it('should return mems with approved status', (done) => {
      const approved = true;
      const urlBasedOnFilter = `/`;
      const expectedCollection = memCollectionOnePage.filter(mem => mem.approved == approved);

      routerEvents$.next(new NavigationEnd(1, '', ''));

      subscription = service.activePageMemCollection$.subscribe(memsCollection => {
        expect(memsCollection.length).toBeGreaterThan(0);
        expectedCollection.forEach(mem => expect(memsCollection).toContain(mem));
        memsCollection.forEach(mem => expect(expectedCollection).toContain(mem));
        done();
      })  
    });

    it(`should return mems with NOT approved status`, (done) => {
      const approved = false;
      const urlBasedOnFilter = `/waiting-room`;
      const expectedCollection = memCollectionOnePage.filter(mem => mem.approved == approved);

      routerEvents$.next(new NavigationEnd(1, urlBasedOnFilter, urlBasedOnFilter));
      
      subscription = service.activePageMemCollection$.subscribe(memsCollection => {
        expect(memsCollection.length).toBeGreaterThan(0);
        expectedCollection.forEach(mem => expect(memsCollection).toContain(mem));
        memsCollection.forEach(mem => expect(expectedCollection).toContain(mem));
        done();
      });
    });

    it('should return mems with specific category', (done) => {
      //based on testMem12
      const specificCategory = testMem12.category;
      const urlBasedOnFilter = `/category/${specificCategory}`;
      const expectedCollection = memCollectionOnePage.filter(mem => mem.category == specificCategory);

      routerEvents$.next(new NavigationEnd(1, urlBasedOnFilter, urlBasedOnFilter));
      
      subscription = service.activePageMemCollection$.subscribe(memsCollection => {
        expect(memsCollection.length).toBeGreaterThan(0);
        expectedCollection.forEach(mem => expect(memsCollection).toContain(mem));
        memsCollection.forEach(mem => expect(expectedCollection).toContain(mem));
        done();
      })
    });

    it(`should return mems with specific tag`, (done) => {
      //based on testMem12
      const specificTag = testMem12.tags[0];
      const urlBasedOnFilter = `/tag/${specificTag}`;
      const expectedCollection = memCollectionOnePage.filter(mem => mem.tags.some(tag => tag == specificTag));

      routerEvents$.next(new NavigationEnd(1, urlBasedOnFilter, urlBasedOnFilter));
      
      subscription = service.activePageMemCollection$.subscribe(memsCollection => {
        expect(memsCollection.length).toBeGreaterThan(0);
        expectedCollection.forEach(mem => expect(memsCollection).toContain(mem));
        memsCollection.forEach(mem => expect(expectedCollection).toContain(mem));
        done();
      });
    });

    it(`should return mems with specific author`, (done) => {
      //based on testMem12
      const specificAuthor = testMem12.authorID;
      const urlBasedOnFilter = `/user/${specificAuthor}`;
      const expectedCollection = memCollectionOnePage.filter(mem => mem.authorID == specificAuthor);

      routerEvents$.next(new NavigationEnd(1, urlBasedOnFilter, urlBasedOnFilter));
      
      subscription = service.activePageMemCollection$.subscribe(memsCollection => {
        expect(memsCollection.length).toBeGreaterThan(0);
        expectedCollection.forEach(mem => expect(memsCollection).toContain(mem));
        memsCollection.forEach(mem => expect(expectedCollection).toContain(mem));
        done();
      });
    });

    xit(`should return mems with top < 6h status`, (done) => {
      //to do...
    });

    xit(`should return mems with top < 12h status`, (done) => {
      //to do...
    });

    xit(`should return mems with top < 24h status`, (done) => {
      //to do...
    });
  });

  describe(`paginator links`, () => {
    beforeEach(() => {
      queryParamMap$.next(convertToParamMap({}));
      routerEvents$.next(new NavigationEnd(1, '/', '/'));
    });

    it(`should return correct links (single page)`, (done) => {
      const onePageOfMems: MemReference[] = new Array(3);
      onePageOfMems.fill(testMem11);
      memCollection$.next(onePageOfMems);
      
      subscription = service.paginatorLinks$.subscribe(links => {
        expect(links.length).toEqual(1);
        expect(links[0].pageNumber).toEqual(1);
        expect(links[0].isSpecialString).toEqual(false);
        done();
      });
    });
    
    it(`should return correct links (two pages)`, (done) => {
      const twoPagesOfMems: MemReference[] = new Array(6);
      twoPagesOfMems.fill(testMem11);
      memCollection$.next(twoPagesOfMems);
      
      subscription = service.paginatorLinks$.subscribe(links => {
        expect(links.length).toEqual(2);

        expect(links[0].pageNumber).toEqual(2);
        expect(links[0].isSpecialString).toEqual(false);

        expect(links[1].pageNumber).toEqual(1);
        expect(links[1].isSpecialString).toEqual(false);
        done();
      });
    });

    it(`should show maksimum 9 links + 2 special characters`, (done) => {
      //  9 links = first page + previous 3 page + active page + next 3 pages + last page
      //  MEMS_PER_PAGE = 3
      const aLotOfMems: MemReference[] = new Array(34);
      aLotOfMems.fill(testMem11);
      memCollection$.next(aLotOfMems);

      const activePageNo = 6;
      queryParamMap$.next(convertToParamMap({ 'page-number': activePageNo }))

      subscription = service.paginatorLinks$.subscribe(links => {
        expect(aLotOfMems.length / 3).toBeGreaterThan(11, 'minimum number of pages to get all possible links and special chars');

        expect(links.length).toEqual(11, 'maksimum lenght of links array');

        expect(links[0].pageNumber).toEqual(12);
        expect(links[1].specialString).toEqual('...');
        expect(links[2].pageNumber).toEqual(activePageNo + 3);
        expect(links[3].pageNumber).toEqual(activePageNo + 2);
        expect(links[4].pageNumber).toEqual(activePageNo + 1);
        expect(links[5].pageNumber).toEqual(activePageNo);
        expect(links[6].pageNumber).toEqual(activePageNo - 1);
        expect(links[7].pageNumber).toEqual(activePageNo - 2);
        expect(links[8].pageNumber).toEqual(activePageNo - 3);
        expect(links[9].specialString).toEqual('...');
        expect(links[10].pageNumber).toEqual(1);
        done();
      });
    });
  });

  describe(`activateNextPage()`, () => {
    let routerService: Router;
    
    beforeEach(() => {
      routerService = TestBed.get(Router);
      routerService.navigate = jasmine.createSpy('navigate').and.resolveTo(true);
    });

    it(`should do nothing if only one page exist`, () => {
      memCollection$.next(memCollectionOnePage);
      queryParamMap$.next(convertToParamMap({}));
      routerEvents$.next(new NavigationEnd(1, '/', '/'));

      service.activateNextPage();

      expect(routerService.navigate).not.toHaveBeenCalled();
    });

    it(`should do nothing if first page is active`, () => {
      memCollection$.next(memCollectionTwoPages);
      queryParamMap$.next(convertToParamMap({'page-number': 1}));
      routerEvents$.next(new NavigationEnd(1, '/page', '/page'));

      service.activateNextPage();

      expect(routerService.navigate).not.toHaveBeenCalled();
    });

    it(`should navigate to the next page`, () => {
      memCollection$.next(memCollectionTwoPages);
      queryParamMap$.next(convertToParamMap({}));
      routerEvents$.next(new NavigationEnd(1, '/', '/'));

      service.activateNextPage();

      expect(routerService.navigate).toHaveBeenCalledOnceWith(['testURL'], {queryParams: {'page-number': 1}});
    });
  });
});
