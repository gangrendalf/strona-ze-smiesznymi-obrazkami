import { Component } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { NgForm } from '@angular/forms';
import { UserRegisterData } from 'src/app/module/authentication/model/user-register-data';
import { Router } from '@angular/router';

@Component({
  selector: 'registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent {
  constructor(private auth: AuthService, private router: Router) { }

  register(nick: string, birthdate: number, email: string, password: string){
    const data: UserRegisterData = {
      nick: nick,
      birthdate: birthdate,
      email: email,
      password: password
    };

    this.auth.registerUser(data)
      .then(
        success => this.router.navigate(['/'])
      ).catch(
        fail => this.router.navigate(['/something-goes-wrong'])
      );
  }
}
