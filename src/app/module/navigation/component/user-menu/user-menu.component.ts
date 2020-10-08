import { Component, ViewChild, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { faUserCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { map, take } from 'rxjs/operators';


@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.sass']
})
export class UserMenuComponent implements OnInit ,AfterViewInit {
  private _userIcon: IconDefinition = faUserCircle;

  @ViewChild('wrapper', { static: true }) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('logoutBtn', {static: true}) logoutBtnRef: ElementRef<HTMLButtonElement>;

  private _userID: string = null;

  @HostListener('click') onClick() {
    this.wrapper.nativeElement.classList.toggle('hidden');
  };

  constructor(private auth: AuthService) { 
  }

  async ngOnInit(){
    this._userID = await this.auth.authState.pipe(take(1), map(state => {return state.user.uid})).toPromise()
  }

  ngAfterViewInit() {
    this.logoutBtnRef.nativeElement.addEventListener('click', () => {
      this.auth.logout();
    })  
  }

}
