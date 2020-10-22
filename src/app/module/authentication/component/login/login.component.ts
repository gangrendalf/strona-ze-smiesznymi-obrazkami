import { Component } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) { }

  login(email: string, password: string) {
    this.auth.login(email, password)
      .then(
        success => this.router.navigate(['/'])
      ).catch(
        fail => this.router.navigate(['/something-goes-wrong'])
      );
  }
}
