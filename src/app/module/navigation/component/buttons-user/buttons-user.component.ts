import { Component, OnInit } from '@angular/core';
import { IAuthState } from 'src/app/model/auth-state';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'buttons-user',
  templateUrl: './buttons-user.component.html',
  styleUrls: ['./buttons-user.component.sass']
})
export class ButtonsUserComponent implements OnInit {
  private _authState: IAuthState = { isLogged: false };

  constructor(public auth: AuthService) {
    this.auth.authState$.subscribe(state => this._authState = state );
   }

  ngOnInit() {
  }

}
