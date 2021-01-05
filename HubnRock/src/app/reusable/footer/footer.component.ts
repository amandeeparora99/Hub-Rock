import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user';
import { HttpCommunicationService } from '../httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public currentUserObject: User;
  public currentUser;
  public userLogged: Boolean = false;
  
  constructor(private _httpService: HttpCommunicationService) {
  }

  ngOnInit(): void {
    this.userLoggedIn();
    this._httpService.currentUser.subscribe(
      data => {
        if (this.userLogged == false) {
          this.userLoggedIn()
        }
        
        this.currentUserObject = data;
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

  obrirTest() {
    document.getElementById("openCreaRepte").click();
  }

}
