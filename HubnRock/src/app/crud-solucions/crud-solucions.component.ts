import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-crud-solucions',
  templateUrl: './crud-solucions.component.html',
  styleUrls: ['./crud-solucions.component.css']
})
export class CrudSolucionsComponent implements OnInit {

  subscriptionHttp$: Subscription;
  subscriptionHttp2$: Subscription;
  reptes = [];
  solucions = [];
  page = 0;
  
  constructor(private httpCommunication: HttpCommunicationService) { }

  ngOnInit(): void {
    this.getAllReptes();
  }

  eliminarSolucio(idUser){
    if(window.confirm("Segur que vols eliminar aquesta solució?")) {
      if(window.confirm("Aquesta opció no té marxa enrere. N'estàs segur/a?")) {
        this.blockSolucio(idUser);
      }
      else{
        window.alert("No s'ha eliminat cap solució.")
      }
    }
  }

  blockSolucio(solucioId){
    this.subscriptionHttp2$ = this.httpCommunication.changeSolucioState(solucioId, 5)
      .pipe(first())
      .subscribe(
        data => {
          if(data.code == 1){
            window.location.reload();
          }
        },
        error => {
        });
  }
  
  changePage(num){
    this.page = num;
  }

  returnSlice(string){
    console.log(string)
    // return string.length>25 ? string.slice(0, 25)+"..." : string
  }

  storeRepte(repteId){
    this.getRepteSolucions(repteId);
  }

  getAllReptes(){
    this.subscriptionHttp$ = this.httpCommunication.crudGetAll()
      .pipe(first())
      .subscribe(
        data => {
          // console.log(data);
          if (data.code == "1") {
            this.reptes = [];
            data.rows.forEach(element => {
              this.reptes.push(element)
            });
            console.log(this.reptes)
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getRepteSolucions(repteId){
    this.subscriptionHttp$ = this.httpCommunication.getRepte(repteId)
      .pipe(first())
      .subscribe(
        data => {
          // console.log(data);
          if (data.code == "1") {
            console.log(data.row.solucions_proposades)
            this.solucions = [];
            data.row.solucions_proposades.forEach(solucio => {
              this.solucions.push(solucio)
            });
          }
          this.page = 2;
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

}
