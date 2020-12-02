import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html',
  styleUrls: ['./validate-account.component.css']
})
export class ValidateAccountComponent implements OnInit {

  constructor(public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService) { }

  public token;
  subscriptionHttp$: Subscription

  ngOnInit(): void {
    console.log("BONDIA PAVOS")
    this.token = this.aRouter.snapshot.params.token;
    console.log(this.token)
    this.subscriptionHttp$ = this.httpCommunication.validateAccount(this.token)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          if (data.code == '1') {
            console.log("FUNCIONA")
          } else {
            console.log("NO FUNCIONA")
          }
      });
  }

}
