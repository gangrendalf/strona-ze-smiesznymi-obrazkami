import { NgModule } from '@angular/core';
import { NavigationComponent } from 'src/app/module/navigation/component/navigation/navigation.component';
import { UserNotificationComponent } from 'src/app/module/navigation/component/user-notification/user-notification.component';
import { UserMenuComponent } from 'src/app/module/navigation/component/user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from './component/buttons-category/buttons-category.component';
import { ButtonsAddComponent } from './component/buttons-add/buttons-add.component';
import { ButtonsLinksComponent } from 'src/app/module/navigation/component/buttons-links/buttons-links.component';
import { ButtonsUserComponent } from './component/buttons-user/buttons-user.component';
import { SearchBarComponent } from './component/search-bar/search-bar.component';



@NgModule({
  declarations: [
    NavigationComponent,
    UserNotificationComponent,
    UserMenuComponent,
    CategoryComponent,
    ButtonsAddComponent,
    ButtonsLinksComponent,
    ButtonsUserComponent,
    SearchBarComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    NavigationComponent,
  ]
})
export class NavigationModule { }
