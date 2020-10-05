import { NgModule } from '@angular/core';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { LoginComponent } from './component/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RemindPasswordComponent } from './component/remind-password/remind-password.component';


@NgModule({
  declarations: [
    RegistrationPageComponent,
    LoginComponent,
    RemindPasswordComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AuthenticationModule { }
