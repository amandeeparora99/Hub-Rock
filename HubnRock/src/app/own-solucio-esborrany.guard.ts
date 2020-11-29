import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OwnSolucioEsborranyGuard implements CanActivate {

  constructor(public toastr: ToastrService, private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idSolucio;
    let idCurrentUser;

    idSolucio = route.paramMap.get('id');
    idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    return this._httpService.getSolucio(idSolucio).pipe(
      map(data => {
        if (data.code == '1') {

          if (idCurrentUser && data.row.solucio_user_iduser == idCurrentUser && data.row.solucio_estat_idestat == 1) {
            return true;
          } else if (idCurrentUser != data.row.solucio_user_iduser) {
            this.toastr.warning('No ets el propietari d\'aquesta solució', 'Accés denegat');
            this.router.navigate(['/'])
            return false;
          } else if (data.row.solucio_estat_idestat != 1) {
            this.toastr.warning('La solució no és un esborrany', 'Accés denegat');
            this.router.navigate(['/'])
            return false;
          } else {
            this.toastr.warning('La solució no és pot editar', 'Accés denegat');
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
