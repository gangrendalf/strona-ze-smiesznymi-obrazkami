import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { IUserLoginData } from 'src/app/model/user-login-data';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  constructor(private auth: AuthService) { }

  login(f: NgForm) {
    let data: IUserLoginData = {
      email: f.value.email,
      password: f.value.password
    }

    this.auth.login(data);
  }

}
