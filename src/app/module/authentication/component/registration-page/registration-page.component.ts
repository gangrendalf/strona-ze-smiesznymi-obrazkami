import { Component } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { NgForm } from '@angular/forms';
import { IUserRegisterData } from 'src/app/model/user-register-data';

@Component({
  selector: 'registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.sass']
})
export class RegistrationPageComponent {
  constructor(private auth: AuthService) { }

  register(f: NgForm){
    const data: IUserRegisterData = {
      nick: f.value.login,
      birthdate: f.value.birthdate,
      email: f.value.email,
      password: f.value.password
    };

    this.auth.registerUser(data);
  }

}
