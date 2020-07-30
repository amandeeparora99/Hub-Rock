import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReusableModule } from '../reusable/reusable.module';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RestorePasswordComponent } from './restorePassword/restore-password.component';  


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    RestorePasswordComponent
  ],
  imports: [
    CommonModule,
    ReusableModule,
    RouterModule
  ]
})
export class AuthenticationModule { }
