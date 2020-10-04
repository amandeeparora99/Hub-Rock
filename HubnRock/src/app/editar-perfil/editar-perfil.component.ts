import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {

  editUserForm: FormGroup;

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;

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
      'required': 'Introdueix un correu',
      'email': 'Introdueix un correu vàlid'
    },
    'nomContrasenya': {
      'required': 'Introdueix una contrasenya',
      'pattern': 'La contrasenya ha de tenir almenys 8 caràcters, una majúscula i un número'
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

    this.editUserForm = this.fb.group({
      nomEmpresa: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      nomResponsable: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      nomCorreu: ['', [Validators.required, Validators.email]],
      contrasenyaGroup: this.fb.group({
        nomContrasenya: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z]).{8,32}$')]],
        nomRepeteixContrasenya: ['', [Validators.required]]
      }, { validator: passwordsMatch }),
      nomNifEmpresa: ['', Validators.required] //format de nif empresa
      //ELS CAMPS QUE NO HI HA AQUI I QUE PERTANYIN A UN 'USUARI' ELS HEM DE PODER PASSAR COM A NULL
    })

    this.subscriptionForm$ = this.editUserForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.editUserForm)
    });
  }

  logValidationErrors(group: FormGroup = this.editUserForm): void {
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

  onSubmit(){
    console.log("submited")
  }

  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()
    this.subscriptionHttp1$?.unsubscribe()
    this.subscriptionHttp2$?.unsubscribe()
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
