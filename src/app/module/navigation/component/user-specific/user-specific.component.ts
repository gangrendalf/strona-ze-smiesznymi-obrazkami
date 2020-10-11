import { Component } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';

@Component({
  selector: 'user-specific',
  templateUrl: './user-specific.component.html',
  styleUrls: ['./user-specific.component.sass']
})
export class ButtonsUserComponent {
  private _userLogged: boolean = false;

  constructor(public auth: AuthService) {
    this.auth.authState.subscribe(authState => this._userLogged = authState.isLogged );
   }
}
