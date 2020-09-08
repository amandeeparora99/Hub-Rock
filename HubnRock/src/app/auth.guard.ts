import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(): boolean {
    if (this._httpService.loggedIn()) {
      return true
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }


}
