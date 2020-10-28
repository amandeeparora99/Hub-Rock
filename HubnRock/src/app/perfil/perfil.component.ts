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

  solucionsNoMore = false;
  solucionsEsborranyNoMore = false;

  reptesNoMore = false;
  reptesEsborranyNoMore = false;

  currentReptesPage = 1;
  currentReptesEsborranyPage = 1;

  currentSolucionsPage = 1;
  currentSolucionsEsborranyPage = 1;

  elements = 6;

  public userSolucions = [];
  public userSolucionsEsborrany = [];

  public userReptes = [];
  public userReptesEsborrany = [];

  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;
  subscriptionHttp3$: Subscription;
  subscriptionHttp4$: Subscription;
  subscriptionHttp5$: Subscription;
  subscriptionHttp6$: Subscription;
  subscriptionHttp7$: Subscription;
  subscriptionCurrentUser$: Subscription;


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

          if (this.httpClient.loggedIn()) {

            this.subscriptionCurrentUser$ = this.httpClient.currentUser.subscribe(
              data => {

                let currentUser = data;

                if (currentUser && currentUser.idUser == this.usuariObject.user_iduser) {
                  this.isOwnUser = true;
                }

                this.loadReptes(this.currentReptesPage, this.elements)
                this.loadReptesEsborrany(this.currentReptesEsborranyPage, this.elements)
                this.loadSolucions(this.currentSolucionsPage, this.elements)
                this.loadSolucionsEsborrany(this.currentSolucionsEsborranyPage, this.elements)


              }
            );


          }


        } else if (data.code == '2') {

          this.usuariExists = false;

        }
      });
  }

  seeMoreReptes() {
    this.currentReptesPage = this.currentReptesPage + 1;
    this.loadReptes(this.currentReptesPage, this.elements)

  }

  seeMoreReptesEsborrany() {
    this.currentReptesEsborranyPage = this.currentReptesEsborranyPage + 1;
    this.loadReptesEsborrany(this.currentReptesEsborranyPage, this.elements)

  }

  seeMoreSolucions() {
    this.currentSolucionsPage = this.currentSolucionsPage + 1;
    this.loadSolucions(this.currentSolucionsPage, this.elements)

  }

  seeMoreSolucionsEsborrany() {
    this.currentSolucionsEsborranyPage = this.currentSolucionsEsborranyPage + 1;
    this.loadSolucionsEsborrany(this.currentSolucionsEsborranyPage, this.elements)

  }

  // loadSolucionsTab() {
  //   if (this.isOwnUser) {

  //     this.subscriptionHttp4$ = this.httpClient.getSolucionsByUser(this.currentSolucionsPage, this.elements).pipe(first())
  //       .subscribe(data => {

  //         this.userSolucions = data.rows;
  //       })

  //     this.subscriptionHttp4$ = this.httpClient.getSolucionsEsborranyByUser(this.currentSolucionsEsborranyPage, this.elements).pipe(first())
  //       .subscribe(data => {

  //         this.userSolucionsEsborrany = data.rows;
  //       })

  //   } else {

  //     this.subscriptionHttp4$ = this.httpClient.getSolucionsByUserId(this.idUsuari, this.currentSolucionsPage, this.elements).pipe(first())
  //       .subscribe(data => {

  //         this.userSolucions = data.rows;
  //       })

  //   }
  // }

  // loadReptesTab() {
  //   if (this.isOwnUser) {

  //     this.subscriptionHttp4$ = this.httpClient.getReptesByUser(this.currentReptesPage, this.elements).pipe(first())
  //       .subscribe(data => {

  //         this.userReptes = data.rows;
  //       })

  //     this.subscriptionHttp4$ = this.httpClient.getReptesEsborranyByUser(this.currentReptesEsborranyPage, this.elements).pipe(first())
  //       .subscribe(data => {

  //         this.userSolucionsEsborrany = data.rows;
  //       })

  //   } else {

  //     this.subscriptionHttp4$ = this.httpClient.getReptesByUserId(this.idUsuari, this.currentReptesPage, this.elements).pipe(first())
  //       .subscribe(data => {

  //         this.userReptes = data.rows;
  //       })

  //   }
  // }

  loadSolucionsEsborrany(pagina, elements) {
    if (this.isOwnUser) {

      this.subscriptionHttp2$ = this.httpClient.getSolucionsEsborranyByUser(pagina, elements).pipe(first())
        .subscribe(data => {
          if (data.code == "1") {
            if (data.rows.length < 1) {
              this.solucionsEsborranyNoMore = true;
            }

            for (let index = 0; index < data.rows.length; index++) {
              const solucioEsborrany = data.rows[index];

              this.userSolucionsEsborrany.push(solucioEsborrany)

              if (index < 5) {
                this.solucionsEsborranyNoMore = true;
              } else {
                this.solucionsEsborranyNoMore = false;
              }
            }
          }
        })
    }
  }

  loadSolucions(pagina, elements) {
    if (this.isOwnUser) {

      this.subscriptionHttp3$ = this.httpClient.getSolucionsByUser(pagina, elements).pipe(first())
        .subscribe(data => {
          if (data.code == "1") {
            if (data.rows.length < 1) {
              this.solucionsNoMore = true;
            }

            for (let index = 0; index < data.rows.length; index++) {
              const solucio = data.rows[index];

              this.userSolucions.push(solucio)

              if (index < 5) {
                this.solucionsNoMore = true;
              } else {
                this.solucionsNoMore = false;
              }
            }
          }
        })
    } else {

      this.subscriptionHttp4$ = this.httpClient.getSolucionsByUserId(this.idUsuari, pagina, elements).pipe(first())
        .subscribe(data => {
          if (data.code == "1") {
            if (data.rows.length < 1) {
              this.solucionsNoMore = true;
            }

            for (let index = 0; index < data.rows.length; index++) {
              const solucio = data.rows[index];

              this.userSolucions.push(solucio)

              if (index < 5) {
                this.solucionsNoMore = true;
              } else {
                this.solucionsNoMore = false;
              }
            }
          }
        });
    }

  }


  loadReptesEsborrany(pagina, elements) {
    if (this.isOwnUser) {

      this.subscriptionHttp5$ = this.httpClient.getReptesEsborranyByUser(pagina, elements).pipe(first())
        .subscribe(data => {
          if (data.code == "1") {
            if (data.rows.length < 1) {
              this.reptesEsborranyNoMore = true;
            }

            for (let index = 0; index < data.rows.length; index++) {
              const repteEsborrany = data.rows[index];

              this.userReptesEsborrany.push(repteEsborrany)

              if (index < 5) {
                this.reptesEsborranyNoMore = true;
              } else {
                this.reptesEsborranyNoMore = false;
              }
            }
          }
        })
    }
  }

  loadReptes(pagina, elements) {

    if (this.isOwnUser) {

      this.subscriptionHttp6$ = this.httpClient.getReptesByUser(pagina, elements).pipe(first())
        .subscribe(data => {
          if (data.code == "1") {
            if (data.rows.length < 1) {
              this.reptesNoMore = true;
            }

            for (let index = 0; index < data.rows.length; index++) {
              const repte = data.rows[index];

              this.userReptes.push(repte)

              if (index < 5) {
                this.reptesNoMore = true;
              } else {
                this.reptesNoMore = false;
              }
            }
          }
        })
    } else {

      this.subscriptionHttp7$ = this.httpClient.getReptesByUserId(this.idUsuari, pagina, elements).pipe(first())
        .subscribe(data => {
          if (data.code == "1") {
            if (data.rows.length < 1) {
              this.reptesNoMore = true;
            }

            for (let index = 0; index < data.rows.length; index++) {
              const solucio = data.rows[index];

              this.userReptes.push(solucio)

              if (index < 5) {
                this.reptesNoMore = true;
              } else {
                this.reptesNoMore = false;
              }
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
    this.subscriptionHttp6$?.unsubscribe()
    this.subscriptionHttp7$?.unsubscribe()
    this.subscriptionCurrentUser$?.unsubscribe()
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
