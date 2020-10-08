import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';

@Component({
  selector: 'buttons-user',
  templateUrl: './buttons-user.component.html',
  styleUrls: ['./buttons-user.component.sass']
})
export class ButtonsUserComponent implements OnInit {
  private _userLogged: boolean = false;

  constructor(public auth: AuthService) {
    this.auth.authState.subscribe(authState => this._userLogged = authState.isLogged );
   }

  ngOnInit() {
  }

}
