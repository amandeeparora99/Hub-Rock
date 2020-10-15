import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-repte',
  templateUrl: './repte.component.html',
  styleUrls: ['./repte.component.css']
})
export class RepteComponent implements OnInit {

  constructor(public router: Router, public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService) { }

  public idRepte = null;
  public repte = null;
  public repteExists = true;
  videoUrl;

  subscriptionHttp$: Subscription

  ngOnInit(): void {
    this.idRepte = this.aRouter.snapshot.params.id;
    if(this.idRepte){
      this.getRepteFromComponent(this.idRepte);
    }
    console.log(this.repte.solucions)
  }

  getRepteFromComponent(id) {
    this.subscriptionHttp$ = this.httpCommunication.getRepte(id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            this.repte = data.row
            this.repteExists = true;
          } else if (data.code == '2'){
            this.repteExists = false;
            // this.router.navigate(['/page-not-found'])
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  ngOnDestroy() {
    this.subscriptionHttp$?.unsubscribe()
  }

  getImage(idparticipants){
    if(idparticipants == 1){
      return '../../assets/illustrations/Company.png';
    }
    else if(idparticipants == 2){
      return '../../assets/illustrations/Startup.png';
    }
    else if(idparticipants == 3){
      return '../../assets/illustrations/Student.png';
    }
    else if(idparticipants == 4){
      return '../../assets/illustrations/Experts.png';
    }
  }

  diesRestants(data_inici, data_final){
    let dateInici = new Date(data_inici);
    let dateFinal = new Date(data_final);
    let currentDate = new Date();

    if(dateInici>currentDate){
      let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      return  "Inicia en " + days + " dies";
    }
    else if (dateInici<currentDate && dateFinal>currentDate) {
      let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      return  "Tenca en " + days + " dies";
    }
    else{
      let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
      if(days>30){
        return  "Tencat fa mesos";
      }
      else{
        return  "Tencat fa " + days + " dies";
      }
      
    }
    
  }

}
