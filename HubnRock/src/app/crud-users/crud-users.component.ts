import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-crud-users',
  templateUrl: './crud-users.component.html',
  styleUrls: ['./crud-users.component.css']
})
export class CrudUsersComponent implements OnInit {

  subscriptionHttp$: Subscription;
  subscriptionHttp2$: Subscription;
  usuaris = [];
  
  constructor(private httpCommunication: HttpCommunicationService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  eliminarUsuari(idUser){
    if(window.confirm("Segur que vols eliminar aquest usuari?")) {
      if(window.confirm("Aquesta opció no té marxa enrere. N'estàs segur/a?")) {
        this.blockUser(idUser);
      }
      else{
        window.alert("No s'ha eliminat cap usuari.")
      }
    }
  }

  blockUser(userId){
    this.subscriptionHttp2$ = this.httpCommunication.blockUser(userId)
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
  

  getAllUsers(){
    this.subscriptionHttp$ = this.httpCommunication.getUsersSearchEmpty(0,0,0,1,9999)
      .pipe(first())
      .subscribe(
        data => {
          // console.log(data);
          if (data.code == "1") {
            this.usuaris = [];
            data.rows.forEach(element => {
              this.usuaris.push(element)
            });
            console.log(this.usuaris)
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }
  
}
