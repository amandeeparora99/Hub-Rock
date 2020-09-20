import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  allReptes = [];

  subscriptionHttp$: Subscription;

  constructor(private httpCommunication: HttpCommunicationService, private router: Router) { }

  ngOnInit(): void {

    this.getAllReptesHomepage();

  }

  getAllReptesHomepage() {
    this.subscriptionHttp$ = this.httpCommunication.getAllValidReptes(1, 10)
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

  diesRestants(data_inici, data_final) {
    return (((new Date(data_final)).valueOf() - (new Date(data_inici)).valueOf()) / (1000 * 60 * 60 * 24)).toFixed()
  }

  ngOnDestroy() {
    this.subscriptionHttp$?.unsubscribe()
  }

}


