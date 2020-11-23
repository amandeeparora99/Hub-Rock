import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class OwnRepteGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idRepte;
    let idCurrentUser;

    idRepte = route.paramMap.get('id');
    idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    return this._httpService.getRepte(idRepte).pipe(
      map(data => {
        if (data.code == '1') {

          if (data.row.user_iduser == idCurrentUser && data.row.estat_idestat != 1 && data.row.estat_idestat != 3 ) {
            return true;
          } else {
            this.router.navigate(['/'])
            return false;
          }

        } else {
          return false;
        }
      }));
  }

}
