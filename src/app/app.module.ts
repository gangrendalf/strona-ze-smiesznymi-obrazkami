import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { MemCardComponent } from './component/mem-card/mem-card.component';
import { MemsSetComponent } from './component/mems-set/mems-set.component';
import { MemAddFormComponent } from './component/mem-add-form/mem-add-form.component';
import { PaginatorComponent } from './component/paginator/paginator.component';
import { RegistrationPageComponent } from './component/registration-page/registration-page.component';
import { LoginComponent } from './component/login/login.component';
import { MoviesSetComponent } from './component/movies-set/movies-set.component';
import { NavigationModule } from './module/navigation/navigation.module';
import { SharedModule } from './module/shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    MemCardComponent,
    MemsSetComponent,
    MemAddFormComponent,
    PaginatorComponent,
    RegistrationPageComponent,
    LoginComponent,
    MoviesSetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NavigationModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
