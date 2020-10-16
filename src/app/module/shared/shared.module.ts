import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { environment } from 'src/environments/environment.prod';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFirestore } from '@angular/fire/firestore';
import { SomethingGoesWrongComponent } from './component/something-goes-wrong/something-goes-wrong.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';



@NgModule({
  declarations: [SomethingGoesWrongComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    FontAwesomeModule,
  ],
  providers: [
    AngularFirestore
  ],
  exports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule,
    AngularFireAuthModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
