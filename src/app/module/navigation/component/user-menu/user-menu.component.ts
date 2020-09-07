import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { AuthService } from 'src/app/module/authentication/service/auth.service';
import { faUserCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.sass']
})
export class UserMenuComponent implements AfterViewInit {
  private _userIcon: IconDefinition = faUserCircle;

  @ViewChild('wrapper', { static: true }) wrapper: ElementRef<HTMLDivElement>;
  @ViewChild('logoutBtn', {static: true}) logoutBtnRef: ElementRef<HTMLButtonElement>;

  @HostListener('click') onClick() {
    this.wrapper.nativeElement.classList.toggle('hidden');
  };

  constructor(private auth: AuthService) { }

  ngAfterViewInit() {
    this.logoutBtnRef.nativeElement.addEventListener('click', () => {
      this.auth.logout();
    })  
  }

}
