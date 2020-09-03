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
import { SolucioComponent } from './solucio/solucio.component';
import { CreacioRepteComponent } from './creacio-repte/creacio-repte.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent},
  { path: 'reptes', component: ReptesComponent},
  { path: 'restore', component: RestorePasswordComponent},
  { path: 'homepage', component: HomepageComponent},
  { path: 'repte', component: RepteComponent, children: [
    { path: ':id', component: RepteComponent }
  ] },
  { path: 'perfil-empresa', component: PerfilEmpresaComponent},
  { path: 'perfil-usuari', component: PerfilUsuariComponent},
  { path: 'solucio', component: SolucioComponent},
  { path: 'creacio-repte', component: CreacioRepteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
