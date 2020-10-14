import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HasUnsavedData } from '../has-unsaved-data';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit, HasUnsavedData {

  editUserForm: FormGroup;

  public idUsuari;
  public usuariObject;

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
    'nomRockstar': {
      'required': 'Introdueix un nom del responsable'
    },
    // 'nomCorreu': {
    //   'required': 'Introdueix un correu',
    //   'email': 'Introdueix un correu vàlid'
    // },
    // 'nomContrasenya': {
    //   'required': 'Introdueix una contrasenya',
    //   'pattern': 'La contrasenya ha de tenir almenys 8 caràcters, una majúscula i un número'
    // },
    // 'nomRepeteixContrasenya': {
    //   'required': 'Introdueix de nou la contrasenya'
    // },
    // 'contrasenyaGroup': {
    //   'passwordMismatch': 'Les contrasenyes no coincideixen'
    // },
    'nifEmpresa': {
      'required': 'Introdueix un NIF empresa'
    },
    'fotoPerfil': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'ocupacio': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'ubicacio': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'bio': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'experiencia': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'educacio': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'pdfFile': {
      'required': 'Introdueix un nom d\'empresa',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
  }

  formErrors = {
    'nomEmpresa': '',
    'nomResponsable': '',
    'nomRockstar': '',
    // 'nomCorreu': '',
    // 'nomContrasenya': '',
    // 'nomRepeteixContrasenya': '',
    // 'contrasenyaGroup': '',
    'nifEmpresa': '',
    'fotoPerfil': '',
    'ocupacio': '',
    'ubicacio': '',
    'bio': '',
    'experiencia': '',
    'educacio': '',
    'pdfFile': ''

  }

  constructor(private fb: FormBuilder, private httpCommunication: HttpCommunicationService, private aRouter: ActivatedRoute) { }

  hasUnsavedData(): boolean {
    return this.editUserForm.dirty;
  }

  ngOnInit(): void {

    this.idUsuari = this.aRouter.snapshot.params.id;

    if (this.idUsuari) {
      this.getUserFromComponent(this.idUsuari)
    }

    this.editUserForm = this.fb.group({
      nomEmpresa: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      nomResponsable: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      nomRockstar: [''],
      // nomCorreu: ['', [Validators.required, Validators.email]],
      // contrasenyaGroup: this.fb.group({
      // nomContrasenya: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z]).{8,32}$')]],
      // nomRepeteixContrasenya: ['', [Validators.required]]
      // }, { validator: passwordsMatch }),
      nifEmpresa: ['', Validators.required], //format de nif empresa
      fotoPerfil: [''],
      ocupacio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      ubicacio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      bio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      experiencia: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      educacio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      pdfFile: ['', [Validators.minLength(2), Validators.maxLength(255)]],

      //ELS CAMPS QUE NO HI HA AQUI I QUE PERTANYIN A UN 'USUARI' ELS HEM DE PODER PASSAR COM A NULL
    })

    this.subscriptionForm$ = this.editUserForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.editUserForm)
    });
  }

  getUserFromComponent(idUsuari) {
    this.subscriptionHttp1$ = this.httpCommunication.getUser(idUsuari).pipe(first())
      .subscribe(data => {
        if (data.code == '1') {

          this.usuariObject = data.row;

          this.editUserForm.patchValue({
            nomEmpresa: this.usuariObject.nom_empresa,
            nomRockstar: this.usuariObject.nom_rockstar,
            nomResponsable: this.usuariObject.nom_responsable,
            nifEmpresa: this.usuariObject.nif__empresa,
            ocupacio: this.usuariObject.ocupacio,
            ubicacio: this.usuariObject.ubicacio,
            bio: this.usuariObject.bio,
            experiencia: this.usuariObject.experiencia,
            educacio: this.usuariObject.educacio,
          })

          console.log(this.usuariObject)

        }
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

  onSubmit() {
    console.log("submited")
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {

    if (this.editUserForm.dirty) {
      $event.returnValue = true;
    }
  }

  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()
    this.subscriptionHttp1$?.unsubscribe()
    this.subscriptionHttp2$?.unsubscribe()
  }

}

// function passwordsMatch(group: AbstractControl): { [key: string]: any } | null {
//   const passwordControl = group.get('nomContrasenya');
//   const confirmPasswordControl = group.get('nomRepeteixContrasenya');

//   if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
//     return null;
//   }
//   else {
//     return { 'passwordMismatch': true };
//   }
// }
