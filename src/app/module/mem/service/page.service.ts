import { Injectable } from '@angular/core';
import { DatabaseService } from '../../shared/service/database.service';
import { Observable, Subject, ReplaySubject, combineLatest } from 'rxjs';
import { ActivatedRoute, NavigationEnd, ParamMap, Router, RouterEvent } from '@angular/router';
import { IItemInfo } from 'src/app/model/item-info';
import { PaginatorLink } from '../model/paginator-link';
import { filter } from 'rxjs/operators';
import { NavigationEvent } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model';
import { FilterType } from '../model/filter-type.enum';
import { Filter } from '../model/filter';

@Injectable({
  providedIn: "root"
})
export class PageService {
  private _MEMS_PER_PAGE: number;
  private _maxPageNumber: number;
  private _activePageNumber: number;


  private _activePageMemCollection$: Subject<string[]> = new ReplaySubject(1);
  private _paginatorLinks$: Subject<PaginatorLink[]> = new ReplaySubject(1);

  public activePageMemCollection$: Observable<string[]> = new Observable();
  public paginatorLinks$: Observable<PaginatorLink[]>;

  constructor(private dbs: DatabaseService, private route: ActivatedRoute, private router: Router) {
    this.initialize();

    this.synchronizeMemsAndActivePageParameters()
      .subscribe(data => {
        let memsInfo: IItemInfo[] = data[0];
        let activeRouteParams: ParamMap = data[1];
        let navigationEndEvent: NavigationEnd = (data[2] as NavigationEnd);

        let filters = this.extractFiltersFromNavigationEvent(navigationEndEvent);
        let filteredMemsInfo: IItemInfo[] = this.applyFilters(memsInfo, filters);

        this.calculateMaxPageNumber(filteredMemsInfo.length);
        this.checkActivePageNumber(activeRouteParams);
        this.calculatePaginatorLinks();

        this.calculateMemIDCollection(filteredMemsInfo);
      })
  }

  private initialize(){
    this.activePageMemCollection$ = this._activePageMemCollection$.asObservable();
    this.paginatorLinks$ = this._paginatorLinks$.asObservable();
    this._MEMS_PER_PAGE = 3;
  }

  private synchronizeMemsAndActivePageParameters(){
    return combineLatest(
      this.dbs.getItemsReference(), 
      this.route.queryParamMap, 
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      );
  }

  private extractFiltersFromNavigationEvent(e: NavigationEnd) {
    let urlWithoutParams: string[] = e.url.slice(1).split('?')[0].split('/')

    let filters: Filter;

    switch (urlWithoutParams[0] as FilterType){
      case FilterType.category:
        filters = {type: FilterType.category, value: urlWithoutParams[1]}
        break;
      case FilterType.waitingRoom:
        filters = {type: FilterType.waitingRoom, value: null}
        break;
      case FilterType.movies:
        filters = {type: FilterType.movies, value: null}
        break;
      case FilterType.top:
        filters = {type: FilterType.top, value: urlWithoutParams[1]}
        break;
      default: break;
    }
    return filters;
  }

  private applyFilters(mems: IItemInfo[], filters: Filter): IItemInfo[]{
    if(!filters)
      return mems;
    
    let filteredMems: IItemInfo[];

    if(filters.type == FilterType.category){
      filteredMems = mems.filter(mem => mem.categoryId == filters.value);
    }
    else
      filteredMems = mems;

    return filteredMems;
  }

  private calculateMaxPageNumber(memsReferenceCount: number) {
    this._maxPageNumber = Math.ceil(memsReferenceCount / this._MEMS_PER_PAGE);
  }

  private checkActivePageNumber(params: ParamMap){
    if(params.has('page-number'))
      this._activePageNumber = +params.get('page-number');
    else
      this._activePageNumber = this._maxPageNumber;
  }

  private calculatePaginatorLinks(){
    let links: PaginatorLink[] = [];
    let delta: number = 3;

    links = [new PaginatorLink(this._activePageNumber)] 
    
    for(let i = 1; this._activePageNumber + i < this._maxPageNumber && i <= delta; i++)
      links.unshift(new PaginatorLink(this._activePageNumber + i));

    if(links[0].pageNumber < this._maxPageNumber - 1)
      links.unshift(new PaginatorLink(null, true, '...'));

    if(this._maxPageNumber != this._activePageNumber)
      links.unshift(new PaginatorLink(this._maxPageNumber));
      
    for(let i = 1; this._activePageNumber - i > 1 && i <= delta; i++)
      links.push(new PaginatorLink(this._activePageNumber - i));
      
    if(links[links.length - 1].pageNumber > 2)
      links.push(new PaginatorLink(null, true, '...'));
    
    if(1 != this._activePageNumber)
      links.push(new PaginatorLink(1));

    links[0].markAsLastPage();

    this._paginatorLinks$.next(links);
  }

  private calculateMemIDCollection(memsInfo: IItemInfo[]){
      let ids = memsInfo.map(memInfo => memInfo.itemId)

      let offset: number = -1;
      let startLocation: number = -1;
      let endLocation: number = -1;
  
      offset = this._MEMS_PER_PAGE;
      endLocation = this._MEMS_PER_PAGE * this._activePageNumber;
  
      while(endLocation > ids.length){
        endLocation--;
        offset--;
      }
  
      startLocation = endLocation - offset;
  
      if(startLocation < 0 || endLocation < 0 || offset < 0){
        console.error('PageService: function calculateMemSet() got at least one negative location parameter.');
      }

      this._activePageMemCollection$.next(ids.slice(startLocation, endLocation).reverse());
  }

  public activateNextPage(){
    let nextPage: number = this._activePageNumber - 1;
    
    if(nextPage < 1)
      nextPage = 1;

    this.router.navigate(['/page'], {queryParams: {'page-number': nextPage}})
  }
}
