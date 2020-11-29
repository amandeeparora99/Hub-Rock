import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CanEditSolucioGuard implements CanActivate {
  constructor(public toastr: ToastrService, private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idSolucio;
    let idCurrentUser;

    idSolucio = route.paramMap.get('id');
    idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    return this._httpService.getSolucio(idSolucio).pipe(
      map(data => {
        if (data.code == 1) {
          let solucio = data.row;

          let dateIniciRepte = new Date(solucio.data_inici);
          let dateFinalRepte = new Date(solucio.data_final);
          let currentDate = new Date();

          if (solucio.solucio_estat_idestat == 3) {
            if (dateIniciRepte < currentDate && dateFinalRepte > currentDate) {

              return true;
            } else {
              this.toastr.warning('El repte no està en procés', 'Accés denegat');
              this.router.navigate(['/'])

              return false;
            }
          } else if (solucio.solucio_estat_idestat == 1) {
            this.toastr.warning('La solució és un esborrany', 'Accés denegat');
            this.router.navigate(['/'])
            return false;

          } else {
            this.toastr.warning('La solució no es pot editar', 'Accés denegat');
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

