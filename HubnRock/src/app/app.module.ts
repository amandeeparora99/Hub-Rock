import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { ReptesComponent } from './reptes/reptes.component';
import { ReusableModule } from './reusable/reusable.module'; 
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  declarations: [
    AppComponent,
    ReptesComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    ReusableModule
  ],
  providers: [HttpCommunicationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
