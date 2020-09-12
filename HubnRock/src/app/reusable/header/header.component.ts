import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../httpCommunicationService/http-communication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public currentUser;

  constructor(private _httpService: HttpCommunicationService, private router: Router) { }

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
}
