import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.sass']
})
export class PaginatorComponent {
  private _lastPage: number = -1;
  private _currentPage: number = -1;
  private _displayPages: number[] = [];

  @ViewChild('wrapper', {static: true}) wrapper: ElementRef<HTMLDivElement>;

  constructor(private ps: PageService, private ar: ActivatedRoute) {
    ps.maxPageNumber$.subscribe(pageAmount => {
      this._lastPage = pageAmount;
      this._currentPage = pageAmount;
      this.createLinks();
    });
    ps.currentPageNumber$.subscribe(currentPage => this._currentPage = currentPage);
  }

  createLinks(){
    this._displayPages = [];

    if(this._currentPage == this._lastPage){
      for(let i = this._lastPage; i > this._lastPage - 10 && i > 0; i--)
        this._displayPages.push(i);
    }
  }

}
