import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpCommunicationService } from 'src/app/reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  accountType: string = 'empresa';
  register: number = 0;

  validationMessages = {
    'nomEmpresa': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'nomResponsable': {
      'required': 'Introdueix un nom del responsable'
    },
    'nomCorreu': {
      'required': 'Introdueix un correu'
    },
    'nomContrasenya': {
      'required': 'Introdueix una contrasenya'
    },
    'nomRepeteixContrasenya': {
      'required': 'Introdueix de nou la contrasenya'
    },
    'contrasenyaGroup': {
      'passwordMismatch': 'Les contrasenyes no coincideixen'
    },
    'nomNifEmpresa': {
      'required': 'Introdueix un NIF empresa'
    }
  }

  formErrors = {
    'nomEmpresa': '',
    'nomResponsable': '',
    'nomCorreu': '',
    'nomContrasenya': '',
    'nomRepeteixContrasenya': '',
    'contrasenyaGroup': '',
    'nomNifEmpresa': ''
  }

  constructor(private fb: FormBuilder, private httpCommunication: HttpCommunicationService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nomEmpresa: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      nomResponsable: ['', Validators.required],
      nomCorreu: ['', Validators.required],
      contrasenyaGroup: this.fb.group({
        nomContrasenya: ['', Validators.required],
        nomRepeteixContrasenya: ['', Validators.required]
      }, { validator: passwordsMatch }),
      nomNifEmpresa: ['', Validators.required]
    })

    this.registerForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.registerForm)
    });
  }

  logValidationErrors(group: FormGroup = this.registerForm): void {
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

  registerNextStep() {
    this.register = 1

  }

  radioChangedHandler(event: any) {
    this.accountType = event.target.value;
    const nifControl = this.registerForm.get('nomNifEmpresa');
    if (event.target.value == "rockstar") {
      nifControl.clearValidators();
    }
    else {
      nifControl.setValidators(Validators.required);
    }
  }

  onSubmit(): void {
    if (this.accountType == 'empresa') {
      this.httpCommunication.registerEmpresa(this.registerForm.controls.nomCorreu.value,
        this.registerForm.get('contrasenyaGroup').get('nomContrasenya').value,
        '0',
         this.registerForm.controls.nomEmpresa.value,
         this.registerForm.controls.nomResponsable.value,
         this.registerForm.controls.nomNifEmpresa.value,
         null,
         null
         )
        .pipe(first())
        .subscribe(
          data => {
            console.log(data);
            if (data.code == 302) {
              //this._router.navigate(["/apps"]);
              console.log("succcessful")

            }
            else if (data.code == 534) {
              this.registerForm.controls['password'].setErrors({ 'password': true });
              console.log("fallat");
            }
            else if (data.code == 533) {
              this.registerForm.controls['email'].setErrors({ 'email': true });
              console.log("fallat");

            }
          },
          error => {
            //this.error = error;
            //this.loading = false;
          });

    }
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
