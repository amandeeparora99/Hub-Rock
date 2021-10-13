import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html',
  styleUrls: ['./validate-account.component.css']
})
export class ValidateAccountComponent implements OnInit {

  constructor(public aRouter: ActivatedRoute, private router: Router, public httpCommunication: HttpCommunicationService, public toastr: ToastrService) { }

  public token;
  subscriptionHttp$: Subscription

  ngOnInit(): void {
    this.token = this.aRouter.snapshot.params.token;
    this.subscriptionHttp$ = this.httpCommunication.validateAccount(this.token)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          if (data.code == '1') {
            this.router.navigate(["/login"]);
            this.toastr.success('El teu correu ha estat validat correctament', 'Validat', {
              timeOut: 10000,
            })
          } else {
            this.toastr.error('Error de servidor', 'Error', {
              timeOut: 10000,
            })
          }
      });
  }



}
