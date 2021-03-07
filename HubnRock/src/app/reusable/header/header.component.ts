import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../httpCommunicationService/http-communication.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/user';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public currentUserObject: User;
  // public userLogged: Boolean = false;
  searchForm: FormGroup;

  constructor(private _httpService: HttpCommunicationService, private router: Router, private fb: FormBuilder) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this._httpService.currentUser.subscribe(
      data => {
        this.currentUserObject = data;
      }
    );

    this.searchForm = this.fb.group({
      keyword: '',
    });
    // if (localStorage.getItem('currentUser')) {
    //   console.log('estic en la merdaaaa')
    //   let currentUserStored = JSON.parse(localStorage.getItem('currentUser'))
    //   this._httpService.saveCurrentUserLocalStorage(currentUserStored.token, currentUserStored.idUser, currentUserStored.email);
    // }

  }

  // userLoggedIn() {
  //   if (this._httpService.loggedIn()) {
  //     this.currentUser = JSON.parse(this._httpService.getCurrentUser());
  //     this.userLogged = true;
  //   } else {
  //     this.userLogged = false;
  //   }

  // }

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
    else if (page == 5) {
      this.router.navigate(['/mapes']);
    }

  }

  currentPathMatch(path, idUser) {
    if (idUser == 0) {
      if (path == this.router.url) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (path + idUser == this.router.url) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  userProfile() {
    this.router.navigate(['/perfil/', this.currentUserObject.idUser])
  }

  getUserProfile(){
    let string = '';
    string = '/perfil/' + this.currentUserObject.idUser;
    return string;
  }

  obrirTest() {
    document.getElementById("openCreaRepte").click();
  }

  search(){
    if(this.searchForm.value.keyword){
      this.router.navigate(['/buscar/'+this.searchForm.value.keyword])
    }
  }
}
