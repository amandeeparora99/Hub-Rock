import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public idUsuari;
  public usuariExists = true;
  public usuariObject;
  public isOwnUser = false;
  public userSolucions;
  public userReptes;

  constructor(public router: Router, public aRouter: ActivatedRoute, private httpClient: HttpCommunicationService) { }

  ngOnInit(): void {

    this.idUsuari = this.aRouter.snapshot.params.id;

    if (this.idUsuari) {
      this.getUserFromComponent(this.idUsuari)
    }

  }

  getUserFromComponent(idUsuari) {
    this.httpClient.getUser(idUsuari).pipe(first())
      .subscribe(data => {
        if (data.code == '1') {

          this.usuariObject = data.row;
          this.usuariExists = true;

          //GET SOLUCIONS FETES PER L'USUARI
          // this.httpClient.getSolucionsByUser().pipe(first())
          //   .subscribe(data => {
          //     if (data.code == '1') {
          //       this.userSolucions = data.rows;
          //       console.log(this.userSolucions)
          //     }
          //   })

          // //GET REPTES FETS PER L'USUARI SI ES DE TIPUS EMPRESA
          // if (!this.usuariObject.empresa_rockstar) {
          //   this.httpClient.getReptesByUser().pipe(first())
          //     .subscribe(data => {
          //       if (data.code == '1') {
          //         this.userReptes = data.rows;
          //         console.log(this.userReptes)
          //       }
          //     })
          // }

          //COMPROVAR SI EL PERFIL ÉS EL DEL USUARI IDENTIFICAT O NO
          if (this.httpClient.loggedIn()) {
            let currentUser = JSON.parse(this.httpClient.getCurrentUser());
            if (currentUser.idUser == this.usuariObject.user_iduser) {
              this.isOwnUser = true;
            }
          }


        } else if (data.code == '2') {

          this.usuariExists = false;

        }
      });
  }
}
