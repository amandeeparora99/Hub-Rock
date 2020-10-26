import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './authentication/register/register.component';
import { LoginComponent } from './authentication/login/login.component';
import { ReptesComponent } from './reptes/reptes.component';
import { RestorePasswordComponent } from './authentication/restorePassword/restore-password.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RepteComponent } from './repte/repte.component';
import { CreacioSolucioComponent } from './creacio-solucio/creacio-solucio.component';
import { CreacioRepteComponent } from './creacio-repte/creacio-repte.component';
import { AuthGuard } from './auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditarSolucioComponent } from './editar-solucio/editar-solucio.component';
import { PerfilComponent } from './perfil/perfil.component';
import { HasUnsavedDataGuard } from './has-unsaved-data.guard';
import { CompanyRoleGuard } from './company-role.guard';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { OwnUserGuard } from './own-user.guard';
import { CrudUsersComponent } from './crud-users/crud-users.component';
import { CrudSolucionsComponent } from './crud-solucions/crud-solucions.component';
import { CrudReptesComponent } from './crud-reptes/crud-reptes.component';
import { OwnSolucioGuard } from './own-solucio.guard';
import { EditarRepteEsborranyComponent } from './editar-repte-esborrany/editar-repte-esborrany.component';
import { OwnRepteEsborranyGuard } from './own-repte-esborrany.guard';
import { SolucioComponent } from './solucio/solucio.component';
import { EditarRepteComponent } from './editar-repte/editar-repte.component';
import { IsAdminGuard } from './is-admin.guard';
import { OwnRepteGuard } from './own-repte.guard';
import { CanEditRepteGuard } from './can-edit-repte.guard';
import { CanParticipateRepteGuard } from './can-participate-repte.guard';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reptes', component: ReptesComponent },
  { path: 'restore', component: RestorePasswordComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'repte/:id', component: RepteComponent },
  { path: 'repte/:id/creacio-solucio', component: CreacioSolucioComponent, canActivate: [AuthGuard, CanParticipateRepteGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'solucio/:id', component: SolucioComponent },
  { path: 'solucio/:id/editar-solucio', component: EditarSolucioComponent, canActivate: [AuthGuard, OwnSolucioGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'repte/:id/editar-repte', component: EditarRepteComponent, canActivate: [AuthGuard, OwnRepteGuard, CanEditRepteGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'repte/:id/editar-esborrany', component: EditarRepteEsborranyComponent, canActivate: [AuthGuard, OwnRepteEsborranyGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'perfil/:id', component: PerfilComponent },
  { path: 'perfil/:id/editar-perfil', component: EditarPerfilComponent, canActivate: [AuthGuard, OwnUserGuard], canDeactivate: [HasUnsavedDataGuard] },
  { path: 'creacio-repte', component: CreacioRepteComponent, canActivate: [AuthGuard, CompanyRoleGuard] },
  { path: 'admin/reptes', component: CrudReptesComponent, canActivate: [AuthGuard, IsAdminGuard] },
  // { path: 'admin/solucions', component: CrudSolucionsComponent, canActivate: [AuthGuard, IsAdminGuard] },
  // { path: 'admin/users', component: CrudUsersComponent, canActivate: [AuthGuard, IsAdminGuard] },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
