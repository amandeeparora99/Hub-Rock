import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpCommunicationService } from 'src/app/reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private httpCommunication: HttpCommunicationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });


  }

  onLogin(): void {
    console.log(this.loginForm.value)
    // console.log("lo que passem" + this.loginForm.controls.email.value, this.loginForm.get(['password']).value)
    this.httpCommunication.login(this.loginForm.controls.email.value, '3024j113024j11')
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data.code == 302) {
            //this._router.navigate(["/apps"]);
            console.log("succcessful")

          }
          else if (data.code == 534) {
            this.loginForm.controls['password'].setErrors({ 'password': true });
            console.log("fallat");
          }
          else if (data.code == 533) {
            this.loginForm.controls['email'].setErrors({ 'email': true });
            console.log("fallat");

          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });

  }

  onLoadDataClick(){
    console.log("=========================================")
    console.log(this.loginForm.value)
  }

}

