import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HasUnsavedData } from '../has-unsaved-data';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { User } from '../user';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit, HasUnsavedData {

  editUserForm: FormGroup;
  currentUser: User;
  userIsRockstar: Boolean;

  formDone = false;

  pdfArray;

  public idUsuari;
  public usuariObject;

  inputValue;
  tags = [];

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
    if (this.formDone) {
      return false;
    } else {
      return this.editUserForm.dirty;
    }
  }

  ngOnInit(): void {

    this.editUserForm = this.fb.group({
      nomEmpresa: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      nomResponsable: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      nomRockstar: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      // nomCorreu: ['', [Validators.required, Validators.email]],
      // contrasenyaGroup: this.fb.group({
      // nomContrasenya: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z]).{8,32}$')]],
      // nomRepeteixContrasenya: ['', [Validators.required]]
      // }, { validator: passwordsMatch }),
      nifEmpresa: ['', [Validators.required, Validators.minLength(3)]], //format de nif empresa
      fotoPerfil: [''],
      ocupacio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      ubicacio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      bio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      experiencia: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      educacio: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      pdfFile: ['', [Validators.minLength(2), Validators.maxLength(255)]],
      inputTags: ['',],
      inputLinkedIn: ['',],
      inputTwitter: ['',],
      inputInstagram: ['',],
      inputFacebook: ['',],

      //ELS CAMPS QUE NO HI HA AQUI I QUE PERTANYIN A UN 'USUARI' ELS HEM DE PODER PASSAR COM A NULL
    })

    this.httpCommunication.currentUser.subscribe(
      data => {
        this.currentUser = data;
        if (this.currentUser) {
          this.userIsRockstar = this.currentUser.userType;
          if (this.userIsRockstar) {
            this.editUserForm.get('nomEmpresa').clearValidators()
            this.editUserForm.get('nomEmpresa').updateValueAndValidity()

            this.editUserForm.get('nomResponsable').clearValidators()
            this.editUserForm.get('nomResponsable').updateValueAndValidity()

            this.editUserForm.get('nifEmpresa').clearValidators()
            this.editUserForm.get('nifEmpresa').updateValueAndValidity()
          } else {
            this.editUserForm.get('nomRockstar').clearValidators()
            this.editUserForm.get('nomRockstar').updateValueAndValidity()
          }
        }
      }
    );

    this.idUsuari = this.aRouter.snapshot.params.id;

    if (this.idUsuari) {
      this.getUserFromComponent(this.idUsuari)
    }

    this.subscriptionForm$ = this.editUserForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.editUserForm)
    });
  }

  getUserFromComponent(idUsuari) {
    this.subscriptionHttp1$ = this.httpCommunication.getUser(idUsuari).pipe(first())
      .subscribe(data => {
        if (data.code == '1') {

          this.usuariObject = data.row;

          if (this.userIsRockstar) {
            this.usuariObject.habilitats.forEach(habilitat => {
              this.tags.push(habilitat.habilitat_nom)
            });
          } else {
            this.usuariObject.serveis.forEach(servei => {
              this.tags.push(servei.servei_nom)
            });
          }

          this.editUserForm.patchValue({
            nomEmpresa: this.usuariObject.nom_empresa,
            nomRockstar: this.usuariObject.nom_rockstar,
            nomResponsable: this.usuariObject.nom_responsable,
            nifEmpresa: this.usuariObject.nif_empresa,
            ocupacio: this.usuariObject.ocupacio,
            ubicacio: this.usuariObject.ubicacio,
            bio: this.usuariObject.bio,
            experiencia: this.usuariObject.experiencia,
            educacio: this.usuariObject.educacio,
            inputLinkedIn: this.usuariObject.xarxes_linkedin,
            inputTwitter: this.usuariObject.xarxes_twitter,
            inputInstagram: this.usuariObject.xarxes_instagram,
            inputFacebook: this.usuariObject.xarxes_facebook,
          })

          //PATCH RECURSOS
          if (this.usuariObject.cv_path) {
            this.pdfArray = this.usuariObject.cv_path
            console.log(this.pdfArray)
          }

          console.log(this.usuariObject)

        }
      });
  }

  logValidationErrorsUntouched(group: FormGroup = this.editUserForm): void {
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
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls) {
      //     if (control instanceof FormGroup) {
      //       this.logValidationErrors(control);
      //     }
      //   }
      // }
    })
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

  onPdfSelected(event) {
    if (event.target.files) {
      let totalSize = 0;

      console.log(event.target.files[0].size, event.target.files)
      for (let index = 0; index < event.target.files.length; index++) {
        const element = event.target.files[index];
        totalSize += element.size
      }

      if (totalSize < 15728640) {
        this.pdfArray = event.target.files
      } else {
        this.pdfArray = null;
        alert('Supera el límit de 15MB')
      }
      // console.log(this.solucioForm.get('pdf').value)
      // Array.from(this.pdfArray).forEach(file => {
      //   console.log(file)
      // });

    }
  }

  resetPdfArray() {
    this.pdfArray = null;
  }

  onSubmit() {
    console.log(this.editUserForm.errors)
    console.log(this.editUserForm.valid)
    if (this.editUserForm.invalid) {
      this.logValidationErrorsUntouched()
    } else {
      this.formDone = true;

      let formData = this.appendUserInfo();
    }
  }

  appendUserInfo(): FormData {
    const formData = new FormData();

    if (!this.userIsRockstar) {  //LOGGED AS EMPRESA
      formData.append('empresa_rockstar', '0');
      if (this.editUserForm.get('InputfotoPerfilLogin').value) {
        formData.append('url_photo_profile', this.editUserForm.get('InputfotoPerfilLogin').value);
      }
      
    } else if (this.userIsRockstar) {  //LOGGED AS ROCKSTAR
      formData.append('empresa_rockstar', '1');
      if (this.editUserForm.get('InputfotoPerfilLogin').value) {
        formData.append('url_photo_profile', this.editUserForm.get('InputfotoPerfilLogin').value);
      }
    }

    // if (this.pdfArray) {
     

    //     formData.append(`recurs_nom[${index}]`, file.name);
    //     formData.append(`recurs_url_fitxer[${index}]`, file);
      
    // }
    return formData;
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {

    if (this.editUserForm.dirty && !this.formDone) {
      $event.returnValue = true;
    }
  }

  onSearchChange(searchValue: string): void {
    if (searchValue.slice(-1) == ',') {
      this.addTag(searchValue.slice(0, -1))
      console.log(searchValue.slice(0, -1) + ": added to string")
      this.inputValue = ''
    }
  }

  addTag(string) {
    this.tags.push(string);
  }

  getTags() {
    console.log(this.tags)
  }

  addTagSubmit(string) {
    this.tags.push(string);
    this.inputValue = ''
  }

  deleteTag(tagName) {
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i] === tagName) {
        this.tags.splice(i, 1);
      }
    }
    console.log(this.tags)
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
