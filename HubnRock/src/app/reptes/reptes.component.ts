import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reptes',
  templateUrl: './reptes.component.html',
  styleUrls: ['./reptes.component.css']
})
export class ReptesComponent implements OnInit {

  currentObertPage = 1;
  currentProcesPage = 1;
  currentTancatPage = 1;

  elements = 6;

  tancatsNoMore = false;
  obertsNoMore = false;
  procesNoMore = false;


  searching = 0;

  allReptes = [];

  reptesOberts = [];
  reptesProces = [];
  reptesTancats = [];

  reptesCerca = [];

  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;
  subscriptionHttp3$: Subscription;
  subscriptionHttp4$: Subscription;
  // subscriptionHttp5$: Subscription;

  constructor(private httpCommunication: HttpCommunicationService, private router: Router) { }

  ngOnInit(): void {
    //this.getReptesReptesPage(this.paginaActual, this.elements);
    this.getReptesOberts(this.currentObertPage, this.elements);
    this.getReptesProces(this.currentProcesPage, this.elements);
    this.getReptesTancats(this.currentTancatPage, this.elements);
  }

  seeMoreOberts() {
    this.currentObertPage = this.currentObertPage + 1;
    this.getReptesOberts(this.currentObertPage, this.elements)
  }

  seeMoreProces() {
    this.currentProcesPage = this.currentProcesPage + 1;
    this.getReptesOberts(this.currentProcesPage, this.elements)

  }

  seeMoreTancats() {
    this.currentTancatPage = this.currentTancatPage + 1;
    this.getReptesTancats(this.currentTancatPage, this.elements)

  }

  getReptesOberts(pagina, elements) {
    this.subscriptionHttp1$ = this.httpCommunication.getReptesOberts(pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {

            for (let index = 0; index < data.rows.length; index++) {
              const repte = data.rows[index];

              this.reptesOberts.push(repte)

              if (index < 5) {
                this.obertsNoMore = true;
              } else {
                this.obertsNoMore = false;
              }
            }
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getReptesProces(pagina, elements) {
    this.subscriptionHttp2$ = this.httpCommunication.getReptesProces(pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            for (let index = 0; index < data.rows.length; index++) {
              const repte = data.rows[index];

              this.reptesProces.push(repte)

              if (index < 5) {
                this.procesNoMore = true;
              } else {
                this.procesNoMore = false;
              }
            }
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getReptesTancats(pagina, elements) {
    this.subscriptionHttp3$ = this.httpCommunication.getReptesTancats(pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {

            for (let index = 0; index < data.rows.length; index++) {
              const repte = data.rows[index];

              this.reptesTancats.push(repte)

              if (index < 5) {
                this.tancatsNoMore = true;
              } else {
                this.tancatsNoMore = false;
              }
            }
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getReptesSearch(string, pagina, elements) {
    this.subscriptionHttp4$ = this.httpCommunication.getReptesSearch(string, pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            this.reptesCerca = data.rows;
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    if (searchValue.length > 2) {
      this.searching = 1;
      this.reptesCerca = [];
      this.getReptesSearch(searchValue, 1, 10);
    }
    else {
      this.searching = 0;
    }
  }



  //AIXO JA NO HO NECESITEM I THINK
  // getReptesReptesPage(pagina, elements) {
  //   this.subscriptionHttp$ = this.httpCommunication.getAllValidReptes(pagina, elements)
  //     .pipe(first())
  //     .subscribe(
  //       data => {
  //         console.log(data.rows);
  //         if (data.code == "1") {
  //           this.allReptes = data.rows;
  //           this.sortReptes();
  //         }
  //       },
  //       error => {
  //         //this.error = error;
  //         //this.loading = false;
  //       });
  // }


  //AIXO TAMPOC HO NECESSITEM
  // sortReptes(){
  //   console.log("hola")
  //   this.allReptes.forEach(repte => {
  //     var currentDate = new Date();
  //     var givenDate = new Date(repte.data_inici);
  //     var givenFinalDate = new Date(repte.data_final);

  //     if(givenDate > currentDate){
  //       this.reptesOberts.push(repte);
  //     }
  //     else if(givenDate <= currentDate && givenFinalDate > currentDate){
  //       this.reptesProces.push(repte);
  //     }
  //     else{
  //       this.reptesTancats.push(repte);
  //     }
  //   })

  //   this.reptesOberts.forEach(element => {
  //     console.log("Obert, comença dia: " + element.data_inici);
  //   });
  //   this.reptesProces.forEach(element => {
  //     console.log("Proces, comença dia: " + element.data_inici);
  //   });
  //   this.reptesTancats.forEach(element => {
  //     console.log("Tancat, comença dia: " + element.data_inici);
  //   });
  // }
  ngOnDestroy() {
    this.subscriptionHttp1$?.unsubscribe()
    this.subscriptionHttp2$?.unsubscribe()
    this.subscriptionHttp3$?.unsubscribe()
    this.subscriptionHttp4$?.unsubscribe()
    // this.subscriptionHttp5$?.unsubscribe()

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

<<<<<<< Updated upstream
    if(dateInici>currentDate){
      let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);

      if(days > 0) {
        return  "Inicia en " + days + " dies";
      }
      else{
        return "Comença demà!"
      }
      
    }
    else if (dateInici<currentDate && dateFinal>currentDate) {
      let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      return  "Tenca en " + days + " dies";
    }
    else{
      let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
      if(days>30){
        return  "Tencat fa mesos";
=======
      if (dateInici > currentDate) {
        let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        return "Inicia en " + days + " dies";
>>>>>>> Stashed changes
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
