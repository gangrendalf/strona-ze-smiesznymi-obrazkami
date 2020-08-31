import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { IAuthState } from 'src/app/model/auth-state';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent {

  private _authState: IAuthState = { isLogged: false };

  constructor(public auth: AuthService) {
    this.auth.authState$.subscribe(state => this._authState = state );
  }

}
