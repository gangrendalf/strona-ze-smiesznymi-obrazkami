import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'profile-sections',
  templateUrl: './profile-sections.component.html',
  styleUrls: ['./profile-sections.component.sass']
})
export class ProfileSectionsComponent{
  @Input('userID') userID: string;
}
