import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MemCardComponent } from './component/mem-card/mem-card.component';
import { MemsSetComponent } from './component/mems-set/mems-set.component';
import { MemAddFormComponent } from './component/mem-add-form/mem-add-form.component';
import { PaginatorComponent } from './component/paginator/paginator.component';
import { MoviesSetComponent } from './component/movies-set/movies-set.component';
import { MemDetailComponent } from './component/mem-detail/mem-detail.component';
import { MemCommentComponent } from './component/mem-comment/mem-comment.component';


@NgModule({
  declarations: [
    MemCardComponent,
    MemsSetComponent,
    MemAddFormComponent,
    PaginatorComponent,
    MoviesSetComponent,
    MemDetailComponent,
    MemCommentComponent,

  ],
  imports: [
    SharedModule
  ],
  exports: [
    MemsSetComponent,
    PaginatorComponent
  ]
})
export class MemModule { }
