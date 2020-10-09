import { NgModule } from '@angular/core';
import { RegistrationComponent } from './component/registration/registration.component';
import { LoginComponent } from './component/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RemindPasswordComponent } from './component/remind-password/remind-password.component';


@NgModule({
  declarations: [
    RegistrationComponent,
    LoginComponent,
    RemindPasswordComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AuthenticationModule { }
