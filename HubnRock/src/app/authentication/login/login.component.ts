import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpCommunicationService } from 'src/app/reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  subscriptionForm$: Subscription;
  subscriptionHttp$: Subscription;
  
  validationMessages = {
    'email': {
      'required': 'Introdueix un correu electrònic.',
      'email': 'Introdueix un correu electrònic vàlid.',
    },
    'password': {
      'required': 'Introdueix una contrasenya.',
      'minlength': 'Contrasenya massa curta.'
    }
  };


  formErrors = {
    'email': '',
    'password': ''
  };

  constructor(private httpCommunication: HttpCommunicationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z]).{8,32}$')]]
    });

    this.subscriptionForm$ = this.loginForm.valueChanges.subscribe(value => {
      this.logValidationErrors(this.loginForm)
    });
  }

  logValidationErrors(group: FormGroup = this.loginForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }

      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }

    })
  }

  onLogin(): void {
    // console.log("lo que passem" + this.loginForm.controls.email.value, this.loginForm.get(['password']).value)
    this.subscriptionHttp$ = this.httpCommunication.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
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

  ngOnDestroy() {
    this.subscriptionForm$.unsubscribe()
    this.subscriptionHttp$.unsubscribe()
}
  
}

