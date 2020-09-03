import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  allReptes = null;
  constructor(private httpCommunication: HttpCommunicationService, private router: Router) { }

  ngOnInit(): void {

    this.getAllReptesHomepage();

  }

  getAllReptesHomepage() {
    this.httpCommunication.getAllReptes()
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
}


