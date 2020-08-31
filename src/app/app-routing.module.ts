import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemAddFormComponent } from './component/mem-add-form/mem-add-form.component';
import { MemsSetComponent } from './component/mems-set/mems-set.component';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { LoginComponent } from './component/login/login.component';
import { MoviesSetComponent } from './component/movies-set/movies-set.component';
import { AuthGuard } from './guard/auth.guard';
import { UnAuthGuard } from './guard/un-auth.guard';


const routes: Routes = [
  { path: '', component: MemsSetComponent},
  { path: 'page', component: MemsSetComponent },
  { path: 'waiting-room', component: MemsSetComponent },
  { path: 'top', component: MemsSetComponent},
  { path: 'movies', component: MoviesSetComponent },
  { path: 'add', component: MemAddFormComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegistrationPageComponent, canActivate: [UnAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
