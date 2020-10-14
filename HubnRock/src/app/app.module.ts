import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { ReptesComponent } from './reptes/reptes.component';
import { ReusableModule } from './reusable/reusable.module';
import { HomepageComponent } from './homepage/homepage.component';
import { RepteComponent } from './repte/repte.component';
import { CreacioSolucioComponent } from './creacio-solucio/creacio-solucio.component';
import { CreacioRepteComponent } from './creacio-repte/creacio-repte.component';
import { AuthGuard } from './auth.guard'
import { HttpInterceptorService } from './http-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditarSolucioComponent } from './editar-solucio/editar-solucio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { CrudReptesComponent } from './crud-reptes/crud-reptes.component';
import { CrudSolucionsComponent } from './crud-solucions/crud-solucions.component';
import { CrudUsersComponent } from './crud-users/crud-users.component';
import { SolucioComponent } from './solucio/solucio.component';

@NgModule({
  declarations: [
    AppComponent,
    ReptesComponent,
    HomepageComponent,
    RepteComponent,
    CreacioSolucioComponent,
    CreacioRepteComponent,
    PageNotFoundComponent,
    EditarSolucioComponent,
    PerfilComponent,
    EditarPerfilComponent,
    CrudReptesComponent,
    CrudSolucionsComponent,
    CrudUsersComponent,
    SolucioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    ReusableModule,
    FormsModule
  ],
  providers: [HttpCommunicationService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
