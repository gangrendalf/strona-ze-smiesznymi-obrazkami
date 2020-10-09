import { Component } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { NgForm } from '@angular/forms';
import { UserRegisterData } from 'src/app/module/authentication/model/user-register-data';
import { Router } from '@angular/router';

@Component({
  selector: 'registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.sass']
})
export class RegistrationPageComponent {
  constructor(private auth: AuthService, private router: Router) { }

  register(form: NgForm){
    const data: UserRegisterData = {
      nick: form.value.login,
      birthdate: form.value.birthdate,
      email: form.value.email,
      password: form.value.password
    };

    this.auth.registerUser(data)
      .then(
        success => this.router.navigate(['/'])
      ).catch(
        fail => this.router.navigate(['/something-goes-wrong'])
      );
  }
}
