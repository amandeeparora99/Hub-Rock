import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { User } from '../user';

@Component({
  selector: 'app-solucio',
  templateUrl: './solucio.component.html',
  styleUrls: ['./solucio.component.css']
})
export class SolucioComponent implements OnInit {

  constructor(public router: Router, public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService) { }

  public idSolucio;
  public solucio;
  public repte;
  public solucioExists = false;
  public currentUser: User;


  public subscriptionHttp1$: Subscription

  ngOnInit(): void {

    this.httpCommunication.currentUser.subscribe(
      data => {
        this.currentUser = data;
      }
    );

    this.idSolucio = this.aRouter.snapshot.params.id;
    this.getSolucioFromComponent(this.idSolucio);

  }

  getSolucioFromComponent(idSolucio) {
    this.subscriptionHttp1$ = this.httpCommunication.getSolucio(idSolucio)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {

            this.solucio = data.row
            this.solucioExists = true;

            this.httpCommunication.getRepte(this.solucio.solucio_proposada_repte_idrepte)
              .pipe(first())
              .subscribe(
                data => {
                  if (data.code == '1') {

                    this.repte = data.row;

                  } else if (data.code == '2') {

                    this.solucioExists = false;

                  }
                });

          } else if (data.code == '2') {

            this.solucioExists = false;
            // this.router.navigate(['/page-not-found'])

          }
        });
  }

  canEdit(): Boolean {
    if (this.currentUser && this.repte) {
      if (this.solucio.estat_idestat != 3) {
        if (this.currentUser.idUser && this.currentUser.idUser == this.solucio.user_iduser) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.currentUser.idUser &&
          this.currentUser.idUser == this.solucio.user_iduser &&
          this.repteEnProces()) {

          return true;
        } else {

          return false;
        }
      }
    }

  }

  canDelete(): Boolean {
    if (this.currentUser && this.repte) {
      if (this.solucio.estat_idestat != 3) {
        if (this.currentUser.idUser && this.currentUser.idUser == this.solucio.user_iduser) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.currentUser.idUser &&
          this.currentUser.idUser == this.solucio.user_iduser &&
          this.repteEnProces()) {

          return true;

        }
      }
    }

  }

  repteEnProces(): Boolean {
    let dateIniciRepte = new Date(this.repte.data_inici);
    let dateFinalRepte = new Date(this.repte.data_final);
    let currentDate = new Date();

    if (dateIniciRepte < currentDate && dateFinalRepte > currentDate) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.subscriptionHttp1$?.unsubscribe()
    // this.subscriptionHttp2$?.unsubscribe()
    // this.subscriptionHttp3$?.unsubscribe()
    // this.subscriptionHttp4$?.unsubscribe()
  }
}
