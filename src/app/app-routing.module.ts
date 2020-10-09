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
import { RemindPasswordComponent } from './module/authentication/component/remind-password/remind-password.component';
import { SomethingGoesWrongComponent } from './module/shared/component/something-goes-wrong/something-goes-wrong.component';
import { PageNotFoundComponent } from './module/shared/component/page-not-found/page-not-found.component';
import { ProfileComponent } from './module/profile/component/profile/profile.component';
import { WallComponent } from './module/profile/component/wall/wall.component';
import { WatchedUsersComponent } from './module/profile/component/watched-users/watched-users.component';
import { WatchedTagsComponent } from './module/profile/component/watched-tags/watched-tags.component';
import { WatchedMemsComponent } from './module/profile/component/watched-mems/watched-mems.component';
import { HistoryComponent } from './module/profile/component/history/history.component';

const routes: Routes = [
  { path: '', component: MemsSetComponent},
  { path: 'something-goes-wrong', component: SomethingGoesWrongComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'page', component: MemsSetComponent },
  { path: 'waiting-room', component: MemsSetComponent },
  { path: 'top/:time-interval', component: MemsSetComponent },
  { path: 'category/:category-name', component: MemsSetComponent },
  { path: 'tag/:tag', component: MemsSetComponent },
  { path: 'movies', component: MoviesSetComponent },
  { path: 'mem/:uid/:nick/:id', component: MemDetailComponent },
  { path: 'add', component: MemAddFormComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegistrationPageComponent, canActivate: [UnAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
  { path: 'remind-password', component: RemindPasswordComponent, canActivate: [UnAuthGuard] },

  { path: 'user/:uid', component: ProfileComponent, runGuardsAndResolvers: 'always', 
    children: [
      { path: '', redirectTo: 'wall', pathMatch: 'full'},
      { path: 'wall', component: WallComponent, runGuardsAndResolvers: 'always' },
      { path: 'watched-users', component: WatchedUsersComponent },
      { path: 'watched-tags', component: WatchedTagsComponent },
      { path: 'watched-mems', component: WatchedMemsComponent },
      { path: 'history', component: HistoryComponent }
    ] 
  },


  // { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
