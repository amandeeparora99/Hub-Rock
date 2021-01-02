import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-crud-reptes',
  templateUrl: './crud-reptes.component.html',
  styleUrls: ['./crud-reptes.component.css']
})
export class CrudReptesComponent implements OnInit {

  public fileStorageUrl = environment.api + '/image/';

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

  empresesChecked: Boolean = false;
  startupsChecked: Boolean = false;
  estudiantsChecked: Boolean = false;
  expertsChecked: Boolean = false;

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
    this.getReptesProces(this.currentProcesPage, this.elements)

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
            if (data.rows.length < 1) {
              this.obertsNoMore = true;
            }
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
            if (data.rows.length < 1) {
              this.procesNoMore = true;
            }

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
            if (data.rows.length < 1) {
              this.tancatsNoMore = true;
            }
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
    if (this.empresesChecked || this.startupsChecked || this.estudiantsChecked || this.expertsChecked) {
      if (string != '') {
        this.subscriptionHttp4$ = this.httpCommunication.getReptesSearchByNameAdmin(string, this.empresesChecked, this.startupsChecked,
          this.estudiantsChecked, this.expertsChecked, 1, 100)
          .pipe(first())
          .subscribe(
            data => {
              console.log(data.rows);
              if (data.code == "1") {
                this.searching = 1;
                this.reptesCerca = [];
                this.reptesCerca = data.rows;
              }
            }
          );
      }
      else {
        this.subscriptionHttp4$ = this.httpCommunication.getReptesSearchByTipusAdmin(this.empresesChecked, this.startupsChecked,
          this.estudiantsChecked, this.expertsChecked, 1, 100)
          .pipe(first())
          .subscribe(
            data => {
              console.log(data.rows);
              if (data.code == "1") {
                this.searching = 1;
                this.reptesCerca = [];
                this.reptesCerca = data.rows;
              }
            }
          );
      }
    }

    else {
      if (string.length > 2) {
        this.subscriptionHttp4$ = this.httpCommunication.getReptesSearchByNameAdmin(string, this.empresesChecked, this.startupsChecked, this.estudiantsChecked,
          this.expertsChecked, pagina, elements)
          .pipe(first())
          .subscribe(
            data => {
              console.log(data.rows);
              if (data.code == "1") {
                this.searching = 1;
                this.reptesCerca = [];
                this.reptesCerca = data.rows;
              }
            }
          );
      }
      else {
        this.reptesCerca = [];
        this.searching = 0;
      }

    }

  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    if (searchValue.length > 2) {
      this.searching = 1;
      this.reptesCerca = [];
      this.getReptesSearch(searchValue, 1, 10);
    }
    else {
      if (this.empresesChecked || this.startupsChecked || this.estudiantsChecked || this.expertsChecked) {
        this.searching = 1;
        this.reptesCerca = [];
        this.getReptesSearch(searchValue, 1, 100);
      }
      else {
        this.reptesCerca = [];
        this.searching = 0;
      }

    }
  }

  canValidateRepte(iniciRepte) {
    let dateIniciRepte = new Date(iniciRepte);
    let currentDate = new Date();

    if (currentDate < dateIniciRepte) {
      return true;
    } else {
      return false;
    }
  }

  changeState(idRepte, estat, iniciRepte?) {
    if (estat == 3) {
      if (this.canValidateRepte(iniciRepte)) {
        let confirmWindow = confirm('Està segur que vol canviar l\'estat d\'aquest repte?')

        if (confirmWindow == true) {
          this.subscriptionHttp4$ = this.httpCommunication.changeStateRepte(idRepte, estat)
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
      }
    } else {
      let confirmWindow = confirm('Està segur que vol canviar l\'estat d\'aquest repte?')

      if (confirmWindow == true) {
        this.subscriptionHttp4$ = this.httpCommunication.changeStateRepte(idRepte, estat)
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
    }


  }

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

      if (dateInici > currentDate) {
        let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);

        if (days > 0) {
          return "Inicia en " + days + " dies";
        }
        else {
          return "Comença demà!"
        }

      }
      else if (dateInici < currentDate && dateFinal > currentDate) {
        let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        return "Tenca en " + days + " dies";
      }
      else {
        let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
        if (days > 30) {
          return "Tencat";
        }
        else if (dateInici < currentDate && dateFinal > currentDate) {
          let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
          return "Tenca en " + days + " dies";
        }
        else {
          let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
          if (days > 30) {
            return "Tencat";
          }
          else {
            return "Tencat fa " + days + " dies";
          }

        }
      }


    }
  }

  toggleEmpreses(event, cerca) {
    if (event.target.checked) {
      this.empresesChecked = true;
    }
    else {
      this.empresesChecked = false;
    }

    this.getReptesSearch(cerca, 1, 100);
  }

  toggleStartups(event, cerca) {
    if (event.target.checked) {
      this.startupsChecked = true;
    }
    else {
      this.startupsChecked = false;
    }

    this.getReptesSearch(cerca, 1, 100);
  }

  toggleEstudiants(event, cerca) {
    if (event.target.checked) {
      this.estudiantsChecked = true;
    }
    else {
      this.estudiantsChecked = false;
    }

    this.getReptesSearch(cerca, 1, 100);
  }

  toggleExperts(event, cerca) {
    if (event.target.checked) {
      this.expertsChecked = true;
    }
    else {
      this.expertsChecked = false;
    }

    this.getReptesSearch(cerca, 1, 100);
  }

}
