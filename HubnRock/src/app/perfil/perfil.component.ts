import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  public loadSolucionsCalled = false;
  public loadReptesCalled = false;


  public userSolucions = [];
  public userSolucionsEsborrany = [];

  public userReptes = [];
  public userReptesEsborrany = [];

  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;
  subscriptionHttp3$: Subscription;
  subscriptionHttp4$: Subscription;
  subscriptionHttp5$: Subscription;


  constructor(public router: Router, public aRouter: ActivatedRoute, private httpClient: HttpCommunicationService) { }

  ngOnInit(): void {

    this.idUsuari = this.aRouter.snapshot.params.id;

    if (this.idUsuari) {
      this.getUserFromComponent(this.idUsuari)
    }

  }

  getUserFromComponent(idUsuari) {
    this.subscriptionHttp1$ = this.httpClient.getUser(idUsuari).pipe(first())
      .subscribe(data => {
        if (data.code == '1') {

          this.usuariObject = data.row;
          this.usuariExists = true;

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

  loadSolucions() {
    if (this.userSolucions.length < 1) {
      this.subscriptionHttp2$ = this.httpClient.getSolucionsByUserId(this.idUsuari).pipe(first())
        .subscribe(data => {
          if (data.code == '1') {

            this.userSolucions = data.rows;

            if (this.isOwnUser) {
              this.subscriptionHttp4$ = this.httpClient.getSolucionsByUser().pipe(first())
                .subscribe(data => {

                  data.rows.forEach(solucioEsborrany => {
                    if (solucioEsborrany.estat_idestat == 1) {
                      this.userSolucionsEsborrany.push(solucioEsborrany);
                    }
                  });
                })
            }

          }
        });
    }

  }

  loadReptes() {
    if (this.userReptes.length < 1) {
      this.subscriptionHttp3$ = this.httpClient.getReptesByUserId(this.idUsuari).pipe(first())
        .subscribe(data => {
          if (data.code == '1') {

            this.userReptes = data.rows;

            if (this.isOwnUser) {
              this.subscriptionHttp5$ = this.httpClient.getReptesByUser().pipe(first())
                .subscribe(data => {

                  data.rows.forEach(repteEsborrany => {
                    if (repteEsborrany.estat_idestat == 1) {
                      this.userReptesEsborrany.push(repteEsborrany);
                    }
                  });
                })
            }
          }
        });
    }
  }


  routeEditProfile() {
    console.log("redireccionant")
    this.router.navigate(['/perfil/' + this.usuariObject.user_iduser + '/editar-perfil']);
  }

  ngOnDestroy() {
    this.subscriptionHttp1$?.unsubscribe()
    this.subscriptionHttp2$?.unsubscribe()
    this.subscriptionHttp3$?.unsubscribe()
    this.subscriptionHttp4$?.unsubscribe()
    this.subscriptionHttp5$?.unsubscribe()
  }

  returnDaydddMMMyyy(day) {
    if (day) {
      var d = day.toString();
      var array;
      var nd;
      array = d.split('/');

      nd = array[1] + "/" + array[0] + "/" + array[2]

      return nd;
    }

  }

  diesRestants(data_inici, data_final) {
    if (data_final && data_inici) {
      let dateInici = new Date(data_inici);
      let dateFinal = new Date(data_final);
      let currentDate = new Date();

      if (dateInici > currentDate) {
        let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        return "Inicia en " + days + " dies";
      }
      else if (dateInici < currentDate && dateFinal > currentDate) {
        let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        return "Tenca en " + days + " dies";
      }
      else {
        let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
        if (days > 30) {
          return "Tencat fa mesos";
        }
        else {
          return "Tencat fa " + days + " dies";
        }

      }
    }


  }

}
