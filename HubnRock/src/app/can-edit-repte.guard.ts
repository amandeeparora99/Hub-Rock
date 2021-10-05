import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CanEditRepteGuard implements CanActivate {
  constructor(public toastr: ToastrService, private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idRepte;
    let idCurrentUser;

    idRepte = route.paramMap.get('id');
    idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    return this._httpService.getRepte(idRepte).pipe(
      map(data => {
        if (data.code == '1') {

          if (data.row.estat_idestat == 2) {
            return true;
          } else if (data.row.estat_idestat == 4) { //Si esta rebutjat, que deixi editar
            return true;
          } else if (data.row.estat_idestat == 1) {
            this.toastr.warning('El repte és un esborrany', 'Accés denegat');
            this.router.navigate(['/'])
            return false;
          } else if (data.row.estat_idestat == 3) {
            this.toastr.warning('El repte ja ha sigut acceptat per un administrador', 'Accés denegat');
            this.router.navigate(['/'])
            return false;
          } else {
            this.toastr.warning('El repte no es pot editar', 'Accés denegat');
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

