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

  tancatsNoMore = false;
  obertsNoMore = false;
  procesNoMore = false;

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
    this.subscriptionHttp1$ = this.httpCommunication.getReptesObertsAdmin(pagina, elements)
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
    this.subscriptionHttp2$ = this.httpCommunication.getReptesProcesAdmin(pagina, elements)
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
    this.subscriptionHttp3$ = this.httpCommunication.getReptesTancatsAdmin(pagina, elements)
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

  repteTancatOrProces(dateInici, dateFinal): Boolean {
    // comprovar que el repte està en procès
    let dateIniciRepte = new Date(dateInici);
    let dateFinalRepte = new Date(dateFinal);
    let currentDate = new Date();

    if ((dateIniciRepte < currentDate && dateFinalRepte > currentDate) ||
      (dateIniciRepte < currentDate && dateFinalRepte < currentDate)) {

      return true;
    } else {
      return false;
    }
  }

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

