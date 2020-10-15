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

  public idSolucio = null;
  public solucio = null;
  videoUrl;

  subscriptionHttp$: Subscription

  ngOnInit(): void {
    this.idSolucio = this.aRouter.snapshot.params.id;
    if(this.solucio){
      this.getRepteFromComponent(this.idSolucio);
      console.log(this.solucio)
    }
  }

  getRepteFromComponent(id) {
    this.subscriptionHttp$ = this.httpCommunication.getSolucio(id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            this.solucio = data.row
          } else if (data.code == '2'){
            this.router.navigate(['/page-not-found'])
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

}
