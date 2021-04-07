import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  validationMessages = {
    'nomContrasenya': {
      'required': 'Introdueix una contrasenya',
      'pattern': 'La contrasenya ha de tenir almenys 8 caràcters, una majúscula i un número'
    },
    'nomRepeteixContrasenya': {
      'required': 'Introdueix de nou la contrasenya'
    },
    'contrasenyaGroup': {
      'passwordMismatch': 'Les contrasenyes no coincideixen'
    }
  }

  formErrors = {
    'nomContrasenya': '',
    'nomRepeteixContrasenya': '',
    'contrasenyaGroup': '',
  }

  constructor(public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService, private router: Router, private fb: FormBuilder) { }

  recoverForm: FormGroup;
  public token;
  subscriptionForm$: Subscription
  subscriptionHttp$: Subscription

  ngOnInit(): void {
    if (this.httpCommunication.loggedIn()) {
      this.router.navigate(["/"]);
    }

    this.token = this.aRouter.snapshot.params.token;
    
    this.recoverForm = this.fb.group({
      contrasenyaGroup: this.fb.group({
        nomContrasenya: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z]).{8,32}$')]],
        nomRepeteixContrasenya: ['', [Validators.required]]
      }, { validator: passwordsMatch }),
    })

    this.subscriptionForm$ = this.recoverForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.recoverForm)
    });
  }


  logValidationErrors(group: FormGroup = this.recoverForm): void {
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


  onSubmit(): void {
    this.subscriptionHttp$ = this.httpCommunication.recoverPassword(this.token, this.recoverForm.get('contrasenyaGroup').get('nomContrasenya').value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            // console.log("DONEIRO")
          } else {
            // console.log("FAILEIRO")
          }
      });
  }

  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()
  }

}

function passwordsMatch(group: AbstractControl): { [key: string]: any } | null {
  const passwordControl = group.get('nomContrasenya');
  const confirmPasswordControl = group.get('nomRepeteixContrasenya');

  if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
    return null;
  }
  else {
    return { 'passwordMismatch': true };
  }
}
