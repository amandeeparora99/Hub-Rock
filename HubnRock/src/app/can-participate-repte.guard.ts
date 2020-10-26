import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class CanParticipateRepteGuard implements CanActivate {

  constructor(private _httpService: HttpCommunicationService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    let idRepte;

    idRepte = route.paramMap.get('id');

    return this._httpService.getRepte(idRepte).pipe(
      map(data => {
        if (data.code == '1') {

          // només si està en procès i és vàlid
          if (data.row.estat_idestat != 3) {

            this.router.navigate(['/homepage'])
            return false;

          } else {

            let dateIniciRepte = new Date(data.row.data_inici);
            let dateFinalRepte = new Date(data.row.data_final);
            let currentDate = new Date();

            if (dateIniciRepte < currentDate && dateFinalRepte > currentDate) {
              return true;
            } else {
              this.router.navigate(['/homepage'])
              return false;
            }
          }


        } else {
          this.router.navigate(['/homepage'])
          return false;
        }
      }));
  }

}
