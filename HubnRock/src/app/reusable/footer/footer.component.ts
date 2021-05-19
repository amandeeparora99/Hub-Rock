import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from 'src/app/user';
import { HttpCommunicationService } from '../httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public currentUserObject: User;
  public currentUser;
  public userLogged: Boolean = false;
  public newsletterForm: FormGroup;
  subscriptionHttp$: Subscription;
  
  constructor(private _httpService: HttpCommunicationService, private fb: FormBuilder, public toastr: ToastrService) {}

  ngOnInit(): void {
    this.userLoggedIn();
    this._httpService.currentUser.subscribe(
      data => {
        if (this.userLogged == false) {
          this.userLoggedIn()
        }
        
        this.currentUserObject = data;
      }
    );

    this.newsletterForm = this.fb.group({
      mailInput: ['', [Validators.email]],
    });
  }

  userLoggedIn() {
    if (this._httpService.loggedIn()) {
      this.currentUser = JSON.parse(this._httpService.getCurrentUser());
      this.userLogged = true;
    } else {
      this.userLogged = false;
    }

  }

  obrirTest() {
    document.getElementById("openCreaRepte").click();
  }

  subNewsletter(){
    var email = { 
      email: this.newsletterForm.value.mailInput
    };

    if(this.newsletterForm.value.mailInput){
      // if(this.newsletterForm.valid){
      //   this.subscriptionHttp$ = this._httpService.subNewsletter(email)
      //     .pipe(first())
      //     .subscribe(
      //       data => {
      //         console.log(data)
      //         if (data.data == "success") {
      //           window.scrollTo(0, 0);
      //           this.newsletterForm.reset();
      //           this.toastr.success('T\'has subscrit al newsletter de Hub & Rock exitosament!', 'Subscripció completada')
      //         }
      //         else{
      //           this.toastr.error('Hi ha hagut algun problema, torna-ho a intentar més tard', 'Error de subscripció')
      //         }
      //       });
      // } else{
      //   this.toastr.error('Introdueix un correu vàlid', 'Correu invàlid')
      // }
    }
  }

}
