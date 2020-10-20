import { NgModule } from '@angular/core';
import { NavigationComponent } from 'src/app/module/navigation/component/navigation/navigation.component';
import { UserNotificationComponent } from 'src/app/module/navigation/component/user-notification/user-notification.component';
import { UserMenuComponent } from 'src/app/module/navigation/component/user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from './component/categories/categories.component';
import { ButtonsAddComponent } from './component/add-mem/add-mem.component';
import { RoomsComponent } from 'src/app/module/navigation/component/rooms/rooms.component';
import { ButtonsUserComponent } from './component/user-specific/user-specific.component';
import { SearchBarComponent } from './component/search-bar/search-bar.component';
import { LogoComponent } from './component/logo/logo.component';



@NgModule({
  declarations: [
    NavigationComponent,
    UserNotificationComponent,
    UserMenuComponent,
    CategoryComponent,
    ButtonsAddComponent,
    RoomsComponent,
    ButtonsUserComponent,
    SearchBarComponent,
    LogoComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    NavigationComponent,
  ]
})
export class NavigationModule { }
