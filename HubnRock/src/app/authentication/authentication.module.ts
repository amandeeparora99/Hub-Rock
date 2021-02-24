import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReusableModule } from '../reusable/reusable.module';
import { HttpClientModule } from '@angular/common/http';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RestorePasswordComponent } from './restorePassword/restore-password.component';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    RestorePasswordComponent
  ],
  imports: [
    CommonModule,
    ReusableModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    HttpCommunicationService
  ]
})
export class AuthenticationModule { }
