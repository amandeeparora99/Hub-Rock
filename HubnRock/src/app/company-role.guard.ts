import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyRoleGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(): boolean {
    // if (this._httpService.userRole() == 1) {
    //   return true
    // } else {
    //   return false
    // }
    return null;
  }

}
