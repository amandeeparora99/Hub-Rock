import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HubnRock';

  constructor(private _httpService: HttpCommunicationService, private router: Router) { }

  onActivate(event) {
    // let scrollToTop = window.setInterval(() => {
    //     let pos = window.pageYOffset;
    //     if (pos > 0) {
    //         window.scrollTo(0, pos - 20); // how far to scroll on each step
    //     } else {
    //         window.clearInterval(scrollToTop);
    //     }
    // }, 5);  //de moment hi posem 5 ms
    window.scrollTo(0, 0)

  }

  ngOnInit() {

    if (localStorage.getItem('currentUser')) {
      let currentUserStored = JSON.parse(localStorage.getItem('currentUser'))
      this._httpService.saveCurrentUserLocalStorage(currentUserStored.token, currentUserStored.idUser, currentUserStored.email);
    }
  }

  noAuthPage() {
    if (localStorage.getItem('currentUser')) {
      if (this.router.url.includes('/registre') || this.router.url.includes('/login') || this.router.url.includes('/validate-account')
        || this.router.url.includes('/recover-password') || this.router.url.includes('/forgot-password')) {
        return false;
      } else {
        return true;
      }
    }
    else{
      return false;
    }

  }
  // onActivate(e) {
  //   if (e.constructor.name)==="login"{ // for example
  //           window.scroll(0,0);
  //   }
  // }
}
