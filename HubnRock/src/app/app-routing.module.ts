import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

//COMPONENTS
import { AppComponent } from './app.component';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginComponent } from './authentication/login/login.component';
import { ReptesComponent } from './reptes/reptes.component';
import { RestorePasswordComponent } from './authentication/restorePassword/restore-password.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RepteComponent } from './repte/repte.component';
import { CreacioSolucioComponent } from './creacio-solucio/creacio-solucio.component';
import { CreacioRepteComponent } from './creacio-repte/creacio-repte.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditarSolucioComponent } from './editar-solucio/editar-solucio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
// import { CrudUsersComponent } from './crud-users/crud-users.component';
// import { CrudSolucionsComponent } from './crud-solucions/crud-solucions.component';
import { CrudReptesComponent } from './crud-reptes/crud-reptes.component';
import { EditarRepteEsborranyComponent } from './editar-repte-esborrany/editar-repte-esborrany.component';
import { SolucioComponent } from './solucio/solucio.component';
import { EditarRepteComponent } from './editar-repte/editar-repte.component';
import { EditarSolucioEsborranyComponent } from './editar-solucio-esborrany/editar-solucio-esborrany.component';
import { ValidateAccountComponent } from "./validate-account/validate-account.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RecoverPasswordComponent } from "./recover-password/recover-password.component";
import { PerEmpresesComponent } from "./per-empreses/per-empreses.component";
import { PerStartupsComponent } from "./per-startups/per-startups.component";
import { FaqComponent } from "./faq/faq.component";
import { SobreHubandrockComponent } from "./sobre-hubandrock/sobre-hubandrock.component";
import { ContacteComponent } from "./contacte/contacte.component";
import { MapesComponent } from './mapes/mapes.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { PoliticaDeCookiesComponent } from "./politica-de-cookies/politica-de-cookies.component";
import { PoliticaDePrivacitatComponent } from "./politica-de-privacitat/politica-de-privacitat.component";
import { TermesICondicionsComponent } from "./termes-i-condicions/termes-i-condicions.component";
import { CrudUsersComponent } from "./crud-users/crud-users.component";
import { CrudSolucionsComponent } from './crud-solucions/crud-solucions.component';

//GUARDS
import { AuthGuard } from './auth.guard';
import { HasUnsavedDataGuard } from './has-unsaved-data.guard';
import { CompanyRoleGuard } from './company-role.guard';
import { OwnUserGuard } from './own-user.guard';
import { OwnSolucioGuard } from './own-solucio.guard';
import { OwnRepteEsborranyGuard } from './own-repte-esborrany.guard';
import { IsAdminGuard } from './is-admin.guard';
import { OwnRepteGuard } from './own-repte.guard';
import { CanEditRepteGuard } from './can-edit-repte.guard';
import { CanParticipateRepteGuard } from './can-participate-repte.guard';
import { SolucioCanViewGuard } from './solucio-can-view.guard';
import { RepteCanViewGuard } from './repte-can-view.guard';
import { OwnSolucioEsborranyGuard } from './own-solucio-esborrany.guard';
import { CanEditSolucioGuard } from './can-edit-solucio.guard';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'registre', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reptes', component: ReptesComponent },
  // { path: 'restore', component: RestorePasswordComponent },
  { path: 'homepage', redirectTo: '' },
  { path: 'repte/:id', component: RepteComponent, canActivate: [RepteCanViewGuard] },
  { path: 'repte/:id/creacio-solucio', component: CreacioSolucioComponent, canActivate: [AuthGuard, CanParticipateRepteGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'solucio/:id', component: SolucioComponent, canActivate: [SolucioCanViewGuard] },
  { path: 'solucio/:id/editar-solucio', component: EditarSolucioComponent, canActivate: [AuthGuard, OwnSolucioGuard, CanEditSolucioGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'solucio/:id/editar-esborrany', component: EditarSolucioEsborranyComponent, canActivate: [AuthGuard, OwnSolucioEsborranyGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'repte/:id/editar-repte', component: EditarRepteComponent, canActivate: [AuthGuard, OwnRepteGuard, CanEditRepteGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'repte/:id/editar-esborrany', component: EditarRepteEsborranyComponent, canActivate: [AuthGuard, OwnRepteEsborranyGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'perfil/:id', component: PerfilComponent },
  { path: 'perfil/:id/editar-perfil', component: EditarPerfilComponent, canActivate: [AuthGuard, OwnUserGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'creacio-repte', component: CreacioRepteComponent, canActivate: [AuthGuard, CompanyRoleGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'admin/reptes', component: CrudReptesComponent, canActivate: [AuthGuard, IsAdminGuard] },
  { path: 'admin/usuaris', component: CrudUsersComponent, canActivate: [AuthGuard, IsAdminGuard] },
  { path: 'admin/solucions', component: CrudSolucionsComponent, canActivate: [AuthGuard, IsAdminGuard] },
  { path: 'validate-account/:token', component: ValidateAccountComponent },
  { path: 'recover-password/:token', component: RecoverPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'per-empreses', component: PerEmpresesComponent },
  { path: 'per-startups', component: PerStartupsComponent },
  { path: 'mapes', component: MapesComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'sobre-hubandrock', component: SobreHubandrockComponent },
  { path: 'contactar', component: ContacteComponent },
  { path: 'politica-de-cookies', component: PoliticaDeCookiesComponent },
  { path: 'politica-de-privacitat', component: PoliticaDePrivacitatComponent },
  { path: 'termes-i-condicions', component: TermesICondicionsComponent },
  { path: 'buscar/:id', component: BuscadorComponent },
  // { path: 'admin/solucions', component: CrudSolucionsComponent, canActivate: [AuthGuard, IsAdminGuard] },
  // { path: 'admin/users', component: CrudUsersComponent, canActivate: [AuthGuard, IsAdminGuard] },
  { path: '**', component: PageNotFoundComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
