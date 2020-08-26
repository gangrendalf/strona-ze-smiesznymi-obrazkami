import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.sass']
})
export class PaginatorComponent {
  private _lastPage: number = -1;
  private _currentPage: number = -1;
  private _displayPages: number[] = [];
  private _lastPageActive: boolean = false; // used in template

  @ViewChild('wrapper', {static: true}) wrapper: ElementRef<HTMLDivElement>;

  constructor(private ps: PageService, private router: Router) {
    ps.maxPageNumber$.subscribe(pageAmount => {
      this._lastPage = pageAmount;
      this._currentPage = pageAmount;
      this.createLinks();
    });
    ps.currentPageNumber$.subscribe(currentPage => this._currentPage = currentPage);

    router.events.subscribe(e => {
      if(e instanceof NavigationEnd)
        router.url == '/' ? this._lastPageActive = true : this._lastPageActive = false;
    })
  }

  createLinks(){
    this._displayPages = [];

    if(this._currentPage == this._lastPage){
      for(let i = this._lastPage; i > this._lastPage - 10 && i > 0; i--)
        this._displayPages.push(i);
    }
  }

}
