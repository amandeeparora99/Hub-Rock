import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpCommunicationService } from 'src/app/reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private httpCommunication: HttpCommunicationService) { }

  ngOnInit(): void {

    //this.httpCommunication.login();

    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });

    /*
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    login(): void
    {
        this._authenticationService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
            .pipe(first())
            .subscribe(
                data => {
                  //console.log(data);
                  if(data.code == 302) {
                    this._router.navigate(["/apps"]);
                  }
                  else if(data.code == 534) {
                    this.loginForm.controls['password'].setErrors({'password': true});
                  }
                  else if(data.code == 533) {
                    this.loginForm.controls['email'].setErrors({'email': true});
                  }
                },
                error => {
                    //this.error = error;
                    //this.loading = false;
                });
    
    */

  }

  onLogin(): void {
    console.log(this.loginForm.value)
  }


}
