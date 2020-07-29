import { Injectable } from '@angular/core';
import { ReusableModule } from '../reusable.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCommunicationService {

  constructor(private http: HttpClient) {

   }
}
