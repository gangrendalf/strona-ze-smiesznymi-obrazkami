import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { UserLoginData } from 'src/app/module/authentication/model/user-login-data';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  login(form: NgForm) {
    const data: UserLoginData = {
      email: form.value.email,
      password: form.value.password
    }

    this.auth.login(data);
  }
}
