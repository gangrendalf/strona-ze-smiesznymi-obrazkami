import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { PageService } from 'src/app/module/mem/service/page.service';
import { PaginatorLink } from '../../model/paginator-link';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.sass']
})
export class PaginatorComponent {
  private _defaultPageActive: boolean = false;
  private _links$: Observable<PaginatorLink[]>

  constructor(private ps: PageService, public route: ActivatedRoute) {
    this._links$ = this.ps.paginatorLinks$; 

    route.queryParamMap
      .subscribe(paramMap => this.checkIfDefaultPageIsActive(paramMap))
  }

  private checkIfDefaultPageIsActive(params: ParamMap){
    !params.has('page-number') 
      ? this._defaultPageActive = true
      : this._defaultPageActive = false;
  }
}
