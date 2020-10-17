import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-crud-reptes',
  templateUrl: './crud-reptes.component.html',
  styleUrls: ['./crud-reptes.component.css']
})
export class CrudReptesComponent implements OnInit {

  currentObertPage = 1;
  currentProcesPage = 1;
  currentTancatPage = 1;

  elements = 6;

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
  subscriptionHttp5$: Subscription;

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

            data.rows.forEach(repte => {
              this.reptesOberts.push(repte)
            });
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

            data.rows.forEach(repte => {
              this.reptesProces.push(repte)
            });
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

            data.rows.forEach(repte => {
              this.reptesTancats.push(repte)
            });
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

  changeState(idRepte, estat) {
    this.subscriptionHttp5$ = this.httpCommunication.changeStateRepte(idRepte, estat)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            window.location.reload();
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
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

  diesRestants(data_inici) {
    let date = new Date(data_inici);
    let currentDate = new Date();

    let days = Math.floor((date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }

  ngOnDestroy() {
    this.subscriptionHttp1$?.unsubscribe()
    this.subscriptionHttp2$?.unsubscribe()
    this.subscriptionHttp3$?.unsubscribe()
    this.subscriptionHttp4$?.unsubscribe()
    this.subscriptionHttp5$?.unsubscribe()


  }
}

