import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { User } from '../user';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  allReptes = [];
  currentUser: User;

  subscriptionHttp$: Subscription;

  constructor(private httpCommunication: HttpCommunicationService, private router: Router) { }

  ngOnInit(): void {

    this.httpCommunication.currentUser.subscribe(
      data => {
        this.currentUser = data;
      }
    );

    this.getAllReptesHomepage();

  }

  getAllReptesHomepage() {
    this.subscriptionHttp$ = this.httpCommunication.getReptesOberts(1, 10)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            this.allReptes = data.rows;

          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  redirectRepte(idrepte) {
    let url: string = "/repte"
    this.router.navigate([url, idrepte]);
  }

  diesRestants(data_inici) {
    let date = new Date(data_inici);
    let currentDate = new Date();

    let days = Math.floor((date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);

    if (days > 0) {
      return days + " dies restants";
    }
    else {
      return "Comença demà!"
    }

  }

  returnDaydddMMMyyy(day) {
    var d = day.toString();
    var array;
    var nd;
    array = d.split('/');

    nd = array[1] + "/" + array[0] + "/" + array[2]

    return nd;
  }

  ngOnDestroy() {
    this.subscriptionHttp$?.unsubscribe()
  }

}


