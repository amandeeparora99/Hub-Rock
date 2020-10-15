import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../httpCommunicationService/http-communication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public currentUser;

  constructor(private _httpService: HttpCommunicationService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {

  }

  userLoggedIn(): boolean {
    if (this._httpService.loggedIn()) {
      this.currentUser = JSON.parse(this._httpService.getCurrentUser());
      return true
    } else {
      return false
    }

  }

  userLogout() {
    this._httpService.logout();
    window.location.reload();
  }

  headerRedirect(page: number) {
    if (page == 1) {
      this.router.navigate(['/']);
    }
    else if (page == 2) {
      this.router.navigate(['/register']);
    }
    else if (page == 3) {
      this.router.navigate(['/login']);
    }
    else if (page == 4) {
      this.router.navigate(['/reptes']);
    }

  }

  userProfile() {
    this.router.navigate(['/perfil/', this.currentUser.idUser])

  }
}
