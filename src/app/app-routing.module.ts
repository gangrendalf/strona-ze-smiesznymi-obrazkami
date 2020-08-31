import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemAddFormComponent } from './component/mem-add-form/mem-add-form.component';
import { MemsSetComponent } from './component/mems-set/mems-set.component';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { LoginComponent } from './component/login/login.component';


const routes: Routes = [
  { path: '', component: MemsSetComponent},
  { path: 'page', component: MemsSetComponent },
  { path: 'add', component: MemAddFormComponent },
  { path: 'register', component: RegistrationPageComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
