import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyRoleGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(): boolean {
    let currentUserType = JSON.parse(localStorage.getItem('currentUser')).userType;
    if(currentUserType == '1'){
      this.router.navigate(['/'])
      return false;
    } else{
      return true;
    }
  }

}
