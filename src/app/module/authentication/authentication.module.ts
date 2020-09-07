import { NgModule } from '@angular/core';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { LoginComponent } from './component/login/login.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    RegistrationPageComponent,
    LoginComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AuthenticationModule { }
