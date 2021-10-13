import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SolucioCanViewGuard implements CanActivate {

  constructor(public toastr: ToastrService, private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idSolucio;
    let idCurrentUser;
    let currentUser;

    idSolucio = route.paramMap.get('id');

    if (this._httpService.loggedIn()) {
      idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;
      currentUser = JSON.parse(localStorage.getItem('currentUser'))
    }


    return this._httpService.getSolucio(idSolucio).pipe(
      map(data => {
        if (data.code == '1') {
          // console.log("CAN VIEW:")
          // console.log(data.row)
          // console.log("USER ID: "+idCurrentUser)
          // console.log("CREADOR SOLUCIO ID: "+data.row.solucio_user_iduser)
          // console.log("REPTE CREADOR ID: "+data.row.repte_user_iduser)
          // console.log("USER ADMIN? "+currentUser.userRole)
          if (data.row.solucio_estat_idestat == 3 && idCurrentUser && (idCurrentUser == data.row.solucio_user_iduser || idCurrentUser == data.row.repte_user_iduser
            || currentUser.userRole == 1)) {
            return true;  //Si és el creador o creador de la solucio o administrador
          } else if (data.row.solucio_estat_idestat != 3 && idCurrentUser && data.row.solucio_user_iduser == idCurrentUser) {
            return true;
          } else {
            this.toastr.warning('Només administradors i el creador del repte/solució hi poden accedir.', 'No es pot accedir a la solució')
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