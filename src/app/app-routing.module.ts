import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemAddFormComponent } from './component/mem-add-form/mem-add-form.component';
import { MemsSetComponent } from './component/mems-set/mems-set.component';


const routes: Routes = [
  { path: 'add/mem', component: MemAddFormComponent },
  { path: 'main-page', component: MemsSetComponent },
  { path: 'page', component: MemsSetComponent },
  { path: '**', redirectTo: 'main-page'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
