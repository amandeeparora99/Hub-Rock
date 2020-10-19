import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class OwnSolucioGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idSolucio;
    let idCurrentUser;

    idSolucio = route.paramMap.get('id');
    idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    return this._httpService.getSolucio(idSolucio).pipe(
      map(data => {
        if (data.code == '1') {

          if (data.row.user_iduser == idCurrentUser && data.row.estat_idestat != 1) {
            return true;
          } else {
            this.router.navigate(['/homepage'])
            return false;
          }

        } else {
          return false;
        }
      }));
  }

}
