import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment.prod';
import { MemCardComponent } from './component/mem-card/mem-card.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from './service/database.service';
import { NavigationComponent } from './component/navigation/navigation.component';
import { MemsSetComponent } from './component/mems-set/mems-set.component';
import { MemAddFormComponent } from './component/mem-add-form/mem-add-form.component';
import { PaginatorComponent } from './component/paginator/paginator.component';

@NgModule({
  declarations: [
    AppComponent,
    MemCardComponent,
    NavigationComponent,
    MemsSetComponent,
    MemAddFormComponent,
    PaginatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule
  ],
  providers: [
    AngularFirestore
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
