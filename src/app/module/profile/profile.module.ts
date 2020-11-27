import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './component/profile/profile.component';
import { WallComponent } from './component/wall/wall.component';
import { WatchedUsersComponent } from './component/watched-users/watched-users.component';
import { WatchedTagsComponent } from './component/watched-tags/watched-tags.component';
import { WatchedMemsComponent } from './component/watched-mems/watched-mems.component';
import { HistoryComponent } from './component/history/history.component';
import { SharedModule } from '../shared/shared.module';
import { MemModule } from '../mem/mem.module';
import { ProfileSectionsComponent } from './profile-sections/profile-sections.component';
import { ProfileActionsComponent } from './profile-actions/profile-actions.component';



@NgModule({
  declarations: [
    ProfileComponent, 
    WallComponent, 
    WatchedUsersComponent, 
    WatchedTagsComponent, 
    WatchedMemsComponent, 
    HistoryComponent, ProfileSectionsComponent, ProfileActionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MemModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
