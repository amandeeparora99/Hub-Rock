import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../httpCommunicationService/http-communication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public currentUserObject: User;
  public currentUser;
  public userLogged: Boolean = false;

  constructor(private _httpService: HttpCommunicationService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.userLoggedIn();
    this._httpService.currentUser.subscribe(
      data => {
        if (this.userLogged == false) {
          this.userLoggedIn()
        }
        
        this.currentUserObject = data;
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHH')
      }
    );

  }

  userLoggedIn() {
    if (this._httpService.loggedIn()) {
      this.currentUser = JSON.parse(this._httpService.getCurrentUser());
      this.userLogged = true;
    } else {
      this.userLogged = false;
    }

  }

  userLogout() {
    this._httpService.logout();
    this.router.navigate(['/'])
      .then(() => {
        window.location.reload();
      });

  }

  headerRedirect(page: number) {
    if (page == 1) {
      this.router.navigate(['/']);
    }
    else if (page == 2) {
      this.router.navigate(['/registre']);
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

  obrirTest() {
    document.getElementById("openCreaRepte").click();
  }
}
