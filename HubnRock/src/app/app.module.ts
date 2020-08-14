import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { ReptesComponent } from './reptes/reptes.component';
import { ReusableModule } from './reusable/reusable.module'; 
import { HomepageComponent } from './homepage/homepage.component';
import { RepteComponent } from './repte/repte.component';
import { PerfilEmpresaComponent } from './perfil-empresa/perfil-empresa.component';


@NgModule({
  declarations: [
    AppComponent,
    ReptesComponent,
    HomepageComponent,
    RepteComponent,
    PerfilEmpresaComponent,
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
