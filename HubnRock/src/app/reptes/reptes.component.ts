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

  allReptes = [];
  reptesOberts = [];
  reptesProces = [];
  reptesTancats = [];

  subscriptionHttp$: Subscription;

  constructor(private httpCommunication: HttpCommunicationService, private router: Router) { }

  ngOnInit(): void {
    this.getAllReptesReptesPage();
    
  }

  getAllReptesReptesPage() {
    this.subscriptionHttp$ = this.httpCommunication.getAllValidReptes(1, 100)
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

  diesRestants(data_inici, data_final) {
    return (((new Date(data_final)).valueOf() - (new Date(data_inici)).valueOf()) / (1000 * 60 * 60 * 24)).toFixed()
  }
}
