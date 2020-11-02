import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class SolucioCanViewGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idSolucio;
    let idCurrentUser;

    idSolucio = route.paramMap.get('id');

    if (this._httpService.loggedIn()) {
      idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;
    }


    return this._httpService.getSolucio(idSolucio).pipe(
      map(data => {
        if (data.code == '1') {

          if (data.row.solucio_estat_idestat == 3) {
            return true;
          } else if (data.row.solucio_estat_idestat != 3 && idCurrentUser && data.row.solucio_user_iduser == idCurrentUser) {
            return true;
          } else {
            this.router.navigate(['/homepage'])
            return false;
          }

        } else {
          return true;
        }
      }));
  }

}