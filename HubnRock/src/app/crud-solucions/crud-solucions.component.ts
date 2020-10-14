import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-crud-solucions',
  templateUrl: './crud-solucions.component.html',
  styleUrls: ['./crud-solucions.component.css']
})
export class CrudSolucionsComponent implements OnInit {

  public solucionsPage = 1;
  public allSolucions = [];


  subscriptionHttp1$: Subscription;

  constructor(private _httpClient: HttpCommunicationService) { }

  ngOnInit(): void {

    this.getMoreSolucions(this.solucionsPage);

  }

  getMoreSolucions(solucionsPage) {
    this.subscriptionHttp1$ = this._httpClient.getSolucionsAdmin(solucionsPage).pipe(first())
      .subscribe(data => {
        if (data.code == '1') {


          if (data.rows.length > 0) {
            data.rows.forEach(solucio => {
              this.allSolucions.push(solucio)
            });
          }
        }


      });
  }

  nextPageSolucions() {
    this.solucionsPage = this.solucionsPage + 1;

    this.getMoreSolucions(this.solucionsPage)
  }

  ngOnDestroy() {
    this.subscriptionHttp1$?.unsubscribe()
    // this.subscriptionHttp2$?.unsubscribe()
  }

}
