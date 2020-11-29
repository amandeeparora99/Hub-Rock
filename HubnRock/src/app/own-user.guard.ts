import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class OwnUserGuard implements CanActivate {


  constructor(public toastr: ToastrService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let idUser;
    let idCurrentUser;

    idUser = route.paramMap.get('id');

    idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    if (idUser == idCurrentUser) {
      return true;
    } else {
      this.toastr.warning('No és el teu perfil', 'Accés denegat');
      this.router.navigate(['/'])
      return false;
    }

  }

}
