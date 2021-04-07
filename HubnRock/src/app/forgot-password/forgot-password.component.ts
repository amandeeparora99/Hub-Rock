import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  fpassForm: FormGroup;
  subscriptionForm$: Subscription;
  subscriptionHttp$: Subscription;
  fpassSuccess = 0;

  validationMessages = {
    'email': {
      'required': 'Introdueix un correu electrònic.',
      'email': 'Introdueix un correu electrònic vàlid.',
      'incorrecte': 'Email incorrecte',
    }
  };

  formErrors = {
    'email': '',
  };

  constructor(private httpCommunication: HttpCommunicationService, private fb: FormBuilder, private router: Router,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.httpCommunication.loggedIn()) {
      this.router.navigate(["/"]);
    }
    this.fpassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // this.subscriptionForm$ = this.fpassForm.valueChanges.subscribe(value => {
    //   this.logValidationErrors(this.fpassForm)
    // });
  }

  logValidationErrorsUntouched(group: FormGroup = this.fpassForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid) {
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

  logValidationErrors(group: FormGroup = this.fpassForm): void {
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
    if (!this.fpassForm.valid) {
      this.logValidationErrorsUntouched()
    } else {
      this.subscriptionHttp$ = this.httpCommunication.sendRecoverLink(this.fpassForm.controls.email.value)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == 1) {
              this.fpassSuccess = 1;
            }
            else {
              this.toastr.error('Hi ha hagut un problema, intenta-ho més tard', 'Error');
            }
          });
    }

  }

  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()
    this.subscriptionHttp$?.unsubscribe()
  }

}
