import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginComponent } from './authentication/login/login.component';
import { ReptesComponent } from './reptes/reptes.component';
import { RestorePasswordComponent } from './authentication/restorePassword/restore-password.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RepteComponent } from './repte/repte.component';
import { PerfilEmpresaComponent } from './perfil-empresa/perfil-empresa.component';
import { PerfilUsuariComponent } from './perfil-usuari/perfil-usuari.component';
import { CreacioSolucioComponent } from './creacio-solucio/creacio-solucio.component';
import { CreacioRepteComponent } from './creacio-repte/creacio-repte.component';
import { AuthGuard } from './auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditarSolucioComponent } from './editar-solucio/editar-solucio.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reptes', component: ReptesComponent },
  { path: 'restore', component: RestorePasswordComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'repte/:id', component: RepteComponent },
  { path: 'repte/:id/creacio-solucio', component: CreacioSolucioComponent, canActivate: [AuthGuard] },
  { path: 'solucio/:id/editar-solucio', component: EditarSolucioComponent, canActivate: [AuthGuard] },
  { path: 'perfil-empresa', component: PerfilEmpresaComponent },
  { path: 'perfil-usuari', component: PerfilUsuariComponent },
  { path: 'creacio-repte', component: CreacioRepteComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
