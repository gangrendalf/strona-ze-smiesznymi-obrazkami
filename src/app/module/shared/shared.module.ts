import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFirestore } from '@angular/fire/firestore';



@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
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
