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
  videoUrl;

  subscriptionHttp$: Subscription

  ngOnInit(): void {
    this.idRepte = this.aRouter.snapshot.params.id;
    if(this.idRepte){
    this.getRepteFromComponent(this.idRepte);
    }
  }

  getRepteFromComponent(id) {
    this.subscriptionHttp$ = this.httpCommunication.getRepte(id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            this.repte = data.row
          } else if (data.code == '2'){
            this.router.navigate(['/page-not-found'])
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

}
