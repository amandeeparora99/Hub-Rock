import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(): Observable<boolean> {
    let idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    return this._httpService.getUser(idCurrentUser).pipe(
      map(data => {
        if (data.code == '1') {

          if (data.row.role_idrole == 1) {
            return true;
          } else {
            this.router.navigate(['/'])
            return false;
          }

        } else {
          this.router.navigate(['/'])

          return false;
        }
      }));

  }

}
