import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from 'src/app/module/navigation/component/navigation/navigation.component';
import { SubNavigationComponent } from 'src/app/module/navigation/component/sub-navigation/sub-navigation.component';
import { UserNotificationComponent } from 'src/app/module/navigation/component/user-notification/user-notification.component';
import { UserMenuComponent } from 'src/app/module/navigation/component/user-menu/user-menu.component';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from './component/buttons-category/buttons-category.component';
import { ButtonsAddComponent } from './component/buttons-add/buttons-add.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ButtonsLinksComponent } from 'src/app/module/navigation/component/buttons-links/buttons-links.component';
import { ButtonsUserComponent } from './component/buttons-user/buttons-user.component';
import { SearchBarComponent } from './component/search-bar/search-bar.component';



@NgModule({
  declarations: [
    NavigationComponent,
    SubNavigationComponent,
    UserNotificationComponent,
    UserMenuComponent,
    CategoryComponent,
    ButtonsAddComponent,
    ButtonsLinksComponent,
    ButtonsUserComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    NavigationComponent,
    SubNavigationComponent
  ]
})
export class NavigationModule { }
