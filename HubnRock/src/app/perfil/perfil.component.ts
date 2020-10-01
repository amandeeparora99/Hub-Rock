import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public usuariObject: any;
  public isOwnUser = false;

  constructor(public router: Router, public aRouter: ActivatedRoute, private httpClient: HttpCommunicationService) { }

  ngOnInit(): void {

    this.idUsuari = this.aRouter.snapshot.params.id;

    if (this.idUsuari) {
      this.getUserFromComponent(this.idUsuari)
    }

  }

  getUserFromComponent(idUsuari) {
    this.httpClient.getUser(idUsuari).pipe(first())
      .subscribe(data => {
        if (data.code == '1') {

          this.usuariObject = data.row;
          this.usuariExists = true;
          
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
}
