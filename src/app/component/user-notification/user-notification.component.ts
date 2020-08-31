import { Component, OnInit } from '@angular/core';
import { IconDefinition, faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.sass']
})
export class UserNotificationComponent {
  private _bellIcon: IconDefinition = faBell;

  constructor() { }

}
