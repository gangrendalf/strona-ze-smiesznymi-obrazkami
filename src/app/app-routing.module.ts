import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemAddFormComponent } from 'src/app/module/mem/component/mem-add-form/mem-add-form.component';
import { MemsSetComponent } from 'src/app/module/mem/component/mems-set/mems-set.component';
import { MoviesSetComponent } from 'src/app/module/mem/component/movies-set/movies-set.component';

import { RegistrationPageComponent } from 'src/app/module/authentication/component/registration-page/registration-page.component';
import { LoginComponent } from 'src/app/module/authentication/component/login/login.component';
import { AuthGuard } from './module/authentication/guard/auth.guard';
import { UnAuthGuard } from './module/authentication/guard/un-auth.guard';
import { MemDetailComponent } from './module/mem/component/mem-detail/mem-detail.component';

const routes: Routes = [
  { path: '', component: MemsSetComponent},
  { path: 'page', component: MemsSetComponent },
  { path: 'waiting-room', component: MemsSetComponent },
  { path: 'top', component: MemsSetComponent},
  { path: 'movies', component: MoviesSetComponent },
  { path: 'mem/:uid/:nick/:id', component: MemDetailComponent },
  { path: 'add', component: MemAddFormComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegistrationPageComponent, canActivate: [UnAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
  // { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
