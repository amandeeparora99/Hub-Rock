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

  paginaActual = 1;
  elements = 10;

  searching = 0;

  allReptes = [];

  reptesOberts = [];
  reptesProces = [];
  reptesTancats = [];

  reptesCerca = [];

  subscriptionHttp$: Subscription;

  constructor(private httpCommunication: HttpCommunicationService, private router: Router) { }

  ngOnInit(): void {
    //this.getAllReptesReptesPage(this.paginaActual, this.elements);
    this.getAllReptesOberts(this.paginaActual, this.elements);
    this.getAllReptesProces(this.paginaActual, this.elements);
    this.getAllReptesTancats(this.paginaActual, this.elements);
  }

  getAllReptesOberts(pagina, elements) {
    this.subscriptionHttp$ = this.httpCommunication.getReptesOberts(pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            this.reptesOberts = data.rows;
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getAllReptesProces(pagina, elements) {
    this.subscriptionHttp$ = this.httpCommunication.getReptesProces(pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            this.reptesProces = data.rows;
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getAllReptesTancats(pagina, elements) {
    this.subscriptionHttp$ = this.httpCommunication.getReptesTancats(pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            this.reptesTancats = data.rows;
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getAllReptesSearch(string, pagina, elements) {
    this.subscriptionHttp$ = this.httpCommunication.getReptesSearch(string, pagina, elements)
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
    if(searchValue.length > 2){
      this.searching = 1;
      this.reptesCerca = [];
      this.getAllReptesSearch(searchValue, 1, 10);
    }
    else{
      this.searching = 0;
    }
  }



  //AIXO JA NO HO NECESITEM I THINK
  getAllReptesReptesPage(pagina, elements) {
    this.subscriptionHttp$ = this.httpCommunication.getAllValidReptes(pagina, elements)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            this.allReptes = data.rows;
            this.sortReptes();
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }


  //AIXO TAMPOC HO NECESSITEM
  sortReptes(){
    console.log("hola")
    this.allReptes.forEach(repte => {
      var currentDate = new Date();
      var givenDate = new Date(repte.data_inici);
      var givenFinalDate = new Date(repte.data_final);
      
      if(givenDate > currentDate){
        this.reptesOberts.push(repte);
      }
      else if(givenDate <= currentDate && givenFinalDate > currentDate){
        this.reptesProces.push(repte);
      }
      else{
        this.reptesTancats.push(repte);
      }
    })
    
    this.reptesOberts.forEach(element => {
      console.log("Obert, comença dia: " + element.data_inici);
    });
    this.reptesProces.forEach(element => {
      console.log("Proces, comença dia: " + element.data_inici);
    });
    this.reptesTancats.forEach(element => {
      console.log("Tancat, comença dia: " + element.data_inici);
    });
  }

  diesRestants(data_inici){
    let date = new Date(data_inici);
    let currentDate = new Date();

    let days = Math.floor((date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }
  
}
