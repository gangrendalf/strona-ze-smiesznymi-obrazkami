import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment.prod';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { MemCardComponent } from './component/mem-card/mem-card.component';
import { NavigationComponent } from './component/navigation/navigation.component';
import { MemsSetComponent } from './component/mems-set/mems-set.component';
import { MemAddFormComponent } from './component/mem-add-form/mem-add-form.component';
import { PaginatorComponent } from './component/paginator/paginator.component';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { LoginComponent } from './component/login/login.component';
import { UserMenuComponent } from './component/user-menu/user-menu.component';
import { UserNotificationComponent } from './component/user-notification/user-notification.component';


@NgModule({
  declarations: [
    AppComponent,
    MemCardComponent,
    NavigationComponent,
    MemsSetComponent,
    MemAddFormComponent,
    PaginatorComponent,
    RegistrationPageComponent,
    LoginComponent,
    UserMenuComponent,
    UserNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [
    AngularFirestore,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
