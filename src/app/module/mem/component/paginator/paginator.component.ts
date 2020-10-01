import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { PageService } from 'src/app/module/mem/service/page.service';
import { PaginatorLink } from '../../model/paginator-link';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.sass']
})
export class PaginatorComponent {
  private _links: PaginatorLink[] = [];
  private _defaultPageActive: boolean = false;
  private _activePath: string;

  constructor(private ps: PageService, public route: ActivatedRoute) {
    ps.paginatorLinks$
      .subscribe(links => this._links = links);

    route.queryParamMap
      .subscribe(paramMap => {
        this.checkIfDefaultPageIsActive(paramMap);
      })

    route.url
      .subscribe(url => {
        this.saveActiveURL(url);
      })
  }

  private checkIfDefaultPageIsActive(params: ParamMap){
    !params.has('page-number') 
      ? this._defaultPageActive = true
      : this._defaultPageActive = false;
  }

  private saveActiveURL(url: UrlSegment[]){
    this._activePath = url.reduce((previous, current) => '/' + previous + current, '');
  }
}
