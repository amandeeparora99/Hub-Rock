import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class RepteCanViewGuard implements CanActivate {

  constructor(public toastr: ToastrService, private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idRepte;
    let idCurrentUser;
    let userRole = null;

    idRepte = route.paramMap.get('id');

    if (this._httpService.loggedIn()) {
      idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;
      userRole = JSON.parse(localStorage.getItem('currentUser')).userRole;
    }

    return this._httpService.getRepte(idRepte).pipe(
      map(data => {
        if (data.code == '1') {

          if (data.row.estat_idestat == 3) {
            return true;
          } else if (data.row.estat_idestat != 3 && idCurrentUser && idCurrentUser == data.row.user_iduser) {
            return true;
          } else if (userRole != null && userRole == 1) {
            return true;
          } else {
            this.toastr.warning('El repte no és vàlid', 'Accés denegat')
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
