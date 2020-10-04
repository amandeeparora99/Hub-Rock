import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnUserGuard implements CanActivate {


  constructor(private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let idUser;
    let idCurrentUser;

    idUser = route.paramMap.get('id');

    idCurrentUser = JSON.parse(localStorage.getItem('currentUser')).idUser;

    if (idUser == idCurrentUser) {
      return true;
    } else {
      this.router.navigate(['/'])
      return false;
    }

  }

}
