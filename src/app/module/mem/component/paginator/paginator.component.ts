import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageService } from 'src/app/module/mem/service/page.service';
import { PaginatorLink } from '../../model/paginator-link';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.sass']
})
export class PaginatorComponent {
  private _displayLinks: PaginatorLink[] = [];
  private _defaultPageActive: boolean = false;

  constructor(private ps: PageService, public route: ActivatedRoute) {
    ps.paginatorLinks$
      .subscribe(links => this._displayLinks = links);

    route.queryParamMap
      .subscribe(paramMap => {
        !paramMap.has('page-number') 
          ? this._defaultPageActive = true
          : this._defaultPageActive = false;
      })
  }
}
