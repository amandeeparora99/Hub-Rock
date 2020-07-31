import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpCommunicationService } from './httpCommunicationService/http-communication.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
  ],
  providers: [
    HttpCommunicationService
  ]
})
export class ReusableModule { }
