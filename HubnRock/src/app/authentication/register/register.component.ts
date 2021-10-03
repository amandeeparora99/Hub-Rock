import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpCommunicationService } from 'src/app/reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('googleInput') googleInput: ElementRef;

  registerForm: FormGroup;
  accountType: string = 'empresa';
  register: number = 0;

  termesChecked = false;
  politicaChecked = false;

  latUser: any = 0;
  lngUser: any = 0;

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;

  tipusEmpresaSelected = 'empresa';
  selectedItemsList = [];
  checkedIDs = [];

  checkboxesIndustriaList = [
    {
      id: '1',
      label: 'Big Data',
      isChecked: false
    },
    {
      id: '2',
      label: 'Biotecnologia',
      isChecked: false
    },
    {
      id: '3',
      label: 'Blockchain',
      isChecked: false
    },
    {
      id: '4',
      label: 'Ciberseguretat',
      isChecked: false
    },
    {
      id: '5',
      label: 'Desenvolupament de software',
      isChecked: false
    },
    {
      id: '6',
      label: 'Fabricació de hardware',
      isChecked: false
    },
    {
      id: '7',
      label: 'Impressió 3D',
      isChecked: false
    },
    {
      id: '8',
      label: 'Intel·ligència artificial',
      isChecked: false
    },
    {
      id: '9',
      label: 'Mobilitat',
      isChecked: false
    },
    {
      id: '10',
      label: 'Realitat virtual i augmentada',
      isChecked: false
    },
    {
      id: '11',
      label: 'UX / UI',
      isChecked: false
    },
    {
      id: '12',
      label: 'Xarxes i telecomunicacions',
      isChecked: false
    },
    {
      id: '13',
      label: 'Activitats financeres i assegurances',
      isChecked: false
    },
    {
      id: '14',
      label: 'Administració pública',
      isChecked: false
    },
    {
      id: '15',
      label: 'Agricultura i alimentació',
      isChecked: false
    },
    {
      id: '16',
      label: 'Arquitectura i construcció',
      isChecked: false
    },
    {
      id: '17',
      label: 'Art, cultura i oci',
      isChecked: false
    },
    {
      id: '18',
      label: 'Assessories i gestories',
      isChecked: false
    },
    {
      id: '19',
      label: 'Comerç',
      isChecked: false
    },
    {
      id: '20',
      label: 'Educació',
      isChecked: false
    },
    {
      id: '21',
      label: 'Energia i aigua',
      isChecked: false
    },
    {
      id: '22',
      label: 'Extracció i transformació de minerals',
      isChecked: false
    },
    {
      id: '23',
      label: 'Investigació i desenvolupament',
      isChecked: false
    },
    {
      id: '24',
      label: 'Hosteleria i restauració',
      isChecked: false
    },
    {
      id: '25',
      label: 'Indústries manufactureres',
      isChecked: false
    },
    {
      id: '26',
      label: 'Indústries transformadores dels metalls',
      isChecked: false
    },
    {
      id: '27',
      label: 'Publicitat i marketing',
      isChecked: false
    },
    {
      id: '28',
      label: 'Recursos humans',
      isChecked: false
    },
    {
      id: '29',
      label: 'Salut',
      isChecked: false
    },
    {
      id: '30',
      label: 'Sostenibilitat i medi ambient',
      isChecked: false
    },
    {
      id: '31',
      label: 'Transport i logística',
      isChecked: false
    },
    {
      id: '32',
      label: 'Turisme',
      isChecked: false
    },
    {
      id: '33',
      label: 'Veterinària',
      isChecked: false
    },
    {
      id: '34',
      label: 'Altres',
      isChecked: false
    },

  ]

  validationMessages = {
    'nomEmpresa': {
      'required': 'És un camp requerit',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'cognom': {
      'required': 'És un camp requerit',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'nomResponsable': {
      'required': 'És un camp requerit',
      'minlength': 'Massa curt',
      'maxlength': 'Massa llarg'
    },
    'nomCorreu': {
      'required': 'Introdueix un correu',
      'email': 'Introdueix un correu vàlid',
      'emailExists': 'Aquest correu ja existeix'
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

  constructor(private fb: FormBuilder, private httpCommunication: HttpCommunicationService, private router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.httpCommunication.loggedIn()) {
      this.router.navigate(["/"]);
    }

    this.registerForm = this.fb.group({
      nomEmpresa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      cognom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      nomResponsable: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      nomCorreu: ['', [Validators.required, Validators.email]],
      contrasenyaGroup: this.fb.group({
        nomContrasenya: ['', [Validators.required, Validators.pattern('(?=.*[0-9])(?=.*[a-z]).{8,32}$')]],
        nomRepeteixContrasenya: ['', [Validators.required]]
      }, { validator: passwordsMatch }),
      nomNifEmpresa: ['', Validators.required] //format de nif empresa
      //ELS CAMPS QUE NO HI HA AQUI I QUE PERTANYIN A UN 'USUARI' ELS HEM DE PODER PASSAR COM A NULL
    })

    this.subscriptionForm$ = this.registerForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.registerForm)
    });

    this.fetchSelectedItems()
    this.fetchCheckedIDs()
  }

  showGoogleAdresses() {
    // console.log(this.googleInput.nativeElement)

    var autocomplete;
    autocomplete = new google.maps.places.Autocomplete(this.googleInput.nativeElement), {
      types: ['geocode'],
      componentRestrictions: {
        country: "ES"
      }
    };
    let context = this;
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
      var near_place = autocomplete.getPlace();
      let place = autocomplete.getPlace();
      context.latUser = place.geometry.location.lat();
      context.lngUser = place.geometry.location.lng();
      // console.log("LATITUD:", context.latUser);
      // console.log("LONGITUD:", context.lngUser);
    });

  }

  // FILTRES REGISTER
  changeSelection() {
    this.fetchSelectedItems()
    this.fetchCheckedIDs()
  }
  fetchSelectedItems() {
    this.selectedItemsList = this.checkboxesIndustriaList.filter((value, index) => {
      return value.isChecked
    });
  }
  fetchCheckedIDs() {
    this.checkedIDs = []
    this.checkboxesIndustriaList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedIDs.push(value.id);
      }
    });
  }

  changeChecked(normes) {
    if (normes == 'termesChecked') {
      this.termesChecked = !(this.termesChecked);
    }
    else if (normes == 'politicaChecked') {
      this.politicaChecked = !(this.politicaChecked);
    }
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

  alertGooglePlace() {
    console.log(this.googleInput.nativeElement.value);
  }

  registerNextStep() {
    window.scrollTo(0, 0)

    this.register = 1;

    const nomEmpresa = this.registerForm.get('nomEmpresa');
    const nifEmpresa = this.registerForm.get('nomNifEmpresa');
    const cognom = this.registerForm.get('cognom');

    if (this.accountType == 'empresa') {
      this.tipusEmpresaSelected = 'empresa'

      nomEmpresa.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(255)]);
      nifEmpresa.setValidators(Validators.required);
      cognom.clearValidators()

      nomEmpresa.updateValueAndValidity()
      nifEmpresa.updateValueAndValidity()
      cognom.updateValueAndValidity()
    }
    else if (this.accountType == 'rockstar') {
      this.tipusEmpresaSelected = 'estudiant'
      nomEmpresa.clearValidators();
      nifEmpresa.clearValidators();
      cognom.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(255)]);

      nomEmpresa.updateValueAndValidity()
      nifEmpresa.updateValueAndValidity()
      cognom.updateValueAndValidity()


    }
  }

  changeTipusEmpresa(tipusEmpresaString) {
    if (this.tipusEmpresaSelected != tipusEmpresaString) {
      this.tipusEmpresaSelected = tipusEmpresaString;
    }
  }
  radioChangedHandler(event: any) {
    this.accountType = event.target.value;
    const nifControl = this.registerForm.get('nomNifEmpresa');
    if (event.target.value == "rockstar") {
      nifControl.clearValidators();
      nifControl.updateValueAndValidity()
    }
    else {
      nifControl.setValidators(Validators.required);
      nifControl.updateValueAndValidity()
    }
  }


  stepBack() {
    window.scrollTo(0, 0)
    this.register = 0;
    this.accountType = 'empresa';
    this.registerForm.reset();
  }

  onSubmit(): void {
    this.subscriptionHttp1$ = this.httpCommunication.emailExists(this.registerForm.controls.nomCorreu.value)
      .subscribe(data => {
        if (data.code == 1) {
          this.formErrors.nomCorreu += this.validationMessages.nomCorreu.emailExists + ' ';

        } else {

          if (this.latUser != 0) {

            if (this.accountType == 'empresa') {

              this.subscriptionHttp1$ = this.httpCommunication.registerEmpresa(this.registerForm.controls.nomCorreu.value,
                this.registerForm.get('contrasenyaGroup').get('nomContrasenya').value,
                this.registerForm.controls.nomEmpresa.value,
                this.registerForm.controls.nomResponsable.value,
                this.registerForm.controls.nomNifEmpresa.value,
                this.checkedIDs,
                this.tipusEmpresaSelected,
                this.latUser,
                this.lngUser,
                this.googleInput.nativeElement.value,

              )
                .pipe(first())
                .subscribe(
                  data => {
                    if (data.code == "1") {
                      this.toastr.success('Revisa el correu per validar el compte', 'Registre completat', {
                        timeOut: 2000,
                      });
                      this.router.navigate(["/login"])
                    }
                    else if (data.code == 534) {
                      this.registerForm.controls['password'].setErrors({ 'password': true });
                    }
                    else if (data.code == 533) {
                      this.registerForm.controls['email'].setErrors({ 'email': true });

                    }
                  },
                  error => {
                    //this.error = error;
                    //this.loading = false;
                  });

            }
            else if (this.accountType == 'rockstar') {
              this.subscriptionHttp2$ = this.httpCommunication.registerRockstar(this.registerForm.controls.nomCorreu.value,
                this.registerForm.get('contrasenyaGroup').get('nomContrasenya').value,
                this.registerForm.controls.nomResponsable.value,
                this.registerForm.controls.cognom.value,
                this.checkedIDs,
                this.tipusEmpresaSelected,
                this.latUser,
                this.lngUser,
                this.googleInput.nativeElement.value,
              )
                .pipe(first())
                .subscribe(
                  data => {
                    if (data.code == "1") {
                      this.toastr.success('Revisa el correu per validar el compte', 'Registre completat', {
                        timeOut: 2000,
                      });
                      this.router.navigate(["/login"]);
                    }
                    else if (data.code == 534) {
                      this.registerForm.controls['password'].setErrors({ 'password': true });
                    }
                    else if (data.code == 533) {
                      this.registerForm.controls['email'].setErrors({ 'email': true });
                    }
                  },
                  error => {
                    //this.error = error;
                    //this.loading = false;
                  });

            }
          }
          else {
            this.toastr.error("Selecciona l'adreça de Google!", "Error de registre!");
          }
        }
      })


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
