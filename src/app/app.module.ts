import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { NavigationModule } from './module/navigation/navigation.module';
import { SharedModule } from './module/shared/shared.module';
import { AuthenticationModule } from './module/authentication/authentication.module';
import { MemModule } from './module/mem/mem.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    NavigationModule,
    AuthenticationModule,
    MemModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
