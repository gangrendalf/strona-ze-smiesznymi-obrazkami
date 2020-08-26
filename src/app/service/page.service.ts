import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private _memsPerPage: number = 3;
  private _maxPageNumber$: Subject<number> = new ReplaySubject(1);
  private _maxPageNumber: number = -1;
  private _currentPageNumber$ : Subject<number> = new ReplaySubject(1);
  private _currentPageNumber: number = -1;
  private _currentMemSet$: Subject<string[]> = new ReplaySubject(1);

  public maxPageNumber$: Observable<number> = new Observable();
  public currentPageNumber$: Observable<number> = new Observable();
  public currentPageMemSet$: Observable<string[]> = new Observable();

  constructor(private dbs: DatabaseService, private router: Router, private route: ActivatedRoute) {
    this.maxPageNumber$ = this._maxPageNumber$.asObservable();
    this.currentPageNumber$ = this._currentPageNumber$.asObservable();
    this.currentPageMemSet$ = this._currentMemSet$.asObservable();

    this.init();
  }

  public async init(){
    await this.calculateMaxPageNumber();    


    this.route.queryParamMap
      .subscribe(params => {
        if(params.has('id')){
          this._currentPageNumber$.next(+params.get('id'));
          this._currentPageNumber = +params.get('id');
        } else {
          this._currentPageNumber$.next(this._maxPageNumber);
          this._currentPageNumber = this._maxPageNumber;
        };

        this.calculateMemSet();
      });
  }

  async calculateMaxPageNumber() {
    let memCount: number = await this.dbs.getMemCount();

    this._maxPageNumber = Math.ceil(memCount / this._memsPerPage);
    this._maxPageNumber$.next(this._maxPageNumber);
  }

  async calculateMemSet(){
    let ids: string[] = await this.dbs.getMemsIds();

    if(ids.length < 1){
      console.error('PageService: function calcuateMemSet() got empty IDs array.');
      return;
    }

    let offset: number = -1;
    let startLocation: number = -1;
    let endLocation: number = -1;

    offset = this._memsPerPage;
    endLocation = this._memsPerPage * this._currentPageNumber;

    while(endLocation > ids.length){
      endLocation--;
      offset--;
    }

    startLocation = endLocation - offset;

    if(startLocation < 0 || endLocation < 0 || offset < 0){
      console.error('PageService: function calculateMemSet() got at least one negative location parameter.');
    }
    
    this._currentMemSet$.next(ids.slice(startLocation, endLocation).reverse());
  }
}
