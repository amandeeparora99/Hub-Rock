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
  public userSolucionsBons = [];

  public userReptes = [];
  public userReptesEsborrany = [];
  public userReptesBons = [];

  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;
  subscriptionHttp3$: Subscription;
  subscriptionHttp4$: Subscription;


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

  loadSolucions() {
    if (this.userSolucions.length < 1) {
      this.subscriptionHttp2$ = this.httpClient.getSolucionsByUser().pipe(first())
        .subscribe(data => {
          if (data.code == '1') {

            this.userSolucions = data.rows;

            data.rows.forEach(solucio => {
              if (solucio.estat_idestat == 1) {
                this.userSolucionsEsborrany.push(solucio)
              } else if (solucio.etat_idestat == 3) {
                this.userSolucionsBons.push(solucio)
              }

            });
            console.log("tots solucions", this.userSolucions, "esborranys solucions", this.userSolucionsEsborrany, "bons solucions", this.userSolucionsBons)


          }
        });
    }

  }

  loadReptes() {
    if (this.userReptes.length < 1) {
      this.subscriptionHttp3$ = this.httpClient.getReptesByUser().pipe(first())
        .subscribe(data => {
          if (data.code == '1') {

            this.userReptes = data.rows;

            data.rows.forEach(repte => {
              if (repte.estat_idestat == 1) {
                this.userReptesEsborrany.push(repte)
              } else if (repte.etat_idestat == 3) {
                this.userReptesBons.push(repte)
              }

            });

            console.log("tots reptes", this.userReptes, "esborranys reptes", this.userReptesEsborrany, "bons reptes", this.userReptesBons)
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
  }

  returnDaydddMMMyyy(day){
    if (day) {
      var d = day.toString();
    var array;
    var nd;
    array = d.split('/');

    nd = array[1] + "/" + array[0] + "/" + array[2]

    return nd;
    }
    
  }

  diesRestants(data_inici, data_final){
    if(data_final && data_inici) {
      let dateInici = new Date(data_inici);
    let dateFinal = new Date(data_final);
    let currentDate = new Date();

    if(dateInici>currentDate){
      let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      return  "Inicia en " + days + " dies";
    }
    else if (dateInici<currentDate && dateFinal>currentDate) {
      let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      return  "Tenca en " + days + " dies";
    }
    else{
      let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
      if(days>30){
        return  "Tencat fa mesos";
      }
      else{
        return  "Tencat fa " + days + " dies";
      }
      
    }
    }
    
    
  }

}
