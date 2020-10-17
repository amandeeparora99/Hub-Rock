import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-solucio',
  templateUrl: './solucio.component.html',
  styleUrls: ['./solucio.component.css']
})
export class SolucioComponent implements OnInit {

  constructor(public router: Router, public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService) { }

  public idSolucio;
  public solucio;
  public solucioExists = false;

  public subscriptionHttp1$: Subscription

  ngOnInit(): void {

    this.idSolucio = this.aRouter.snapshot.params.id;
    this.getRepteFromComponent(this.idSolucio);

  }

  getRepteFromComponent(idSolucio) {
    this.subscriptionHttp1$ = this.httpCommunication.getSolucio(idSolucio)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {

            this.solucio = data.row
            this.solucioExists = true;
            console.log(this.solucio)

          } else if (data.code == '2') {

            this.solucioExists = false;
            // this.router.navigate(['/page-not-found'])

          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  ngOnDestroy() {
    this.subscriptionHttp1$?.unsubscribe()
    // this.subscriptionHttp2$?.unsubscribe()
    // this.subscriptionHttp3$?.unsubscribe()
    // this.subscriptionHttp4$?.unsubscribe()
  }
}
