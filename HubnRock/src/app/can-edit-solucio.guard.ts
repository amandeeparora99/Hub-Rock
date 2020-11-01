import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class CanEditSolucioGuard implements CanActivate {
  constructor(private _httpService: HttpCommunicationService, private router: Router) {

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
          if (solucio.data_inici && solucio.data_final) {
            let dateIniciRepte = new Date(solucio.data_inici);
            let dateFinalRepte = new Date(solucio.data_final);
            let currentDate = new Date();

            if (dateIniciRepte < currentDate && dateFinalRepte > currentDate) {
              console.log('retorno true')
              return true;
            } else {
              this.router.navigate(['/homepage'])
              console.log('retorno false')

              return false;
            }
          } else{
            console.log('no tinc dates')

          }


        } else {
          this.router.navigate(['/homepage'])
          return false;
        }
      }));
  }

}

