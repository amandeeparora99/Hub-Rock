import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-perfil-usuari',
  templateUrl: './perfil-usuari.component.html',
  styleUrls: ['./perfil-usuari.component.css']
})
export class PerfilUsuariComponent implements OnInit {

  constructor(public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService) { }

  public idUser = null;
  public user = null;
  subscriptionHttp$: Subscription

  ngOnInit(): void {
    this.idUser = this.aRouter.snapshot.params.id;
    this.getUserComponent(this.idUser);
  }

  getUserComponent(id) {
    this.subscriptionHttp$ = this.httpCommunication.getRepte(id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == "1") {
            this.user = data.row
            console.log("USUARI EN QUESTIO: ")
            console.log(this.user)
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

}
