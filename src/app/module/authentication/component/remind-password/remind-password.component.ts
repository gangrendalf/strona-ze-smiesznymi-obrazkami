import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.sass']
})
export class RemindPasswordComponent {

  constructor(private auth: AuthService, private router: Router) { }

  private remindPassword(form: NgForm){
    const email: string = form.value.email;

    this.auth.resetPassword(email)
      .then(
        () => this.router.navigateByUrl('/'),
        (error) => this.router.navigateByUrl('/something-goes-wrong', {queryParams: {message: error}})
      )
      .catch(
        (error) => this.router.navigateByUrl('/something-goes-wrong', {queryParams: {message: error}})
      );
  }
}
