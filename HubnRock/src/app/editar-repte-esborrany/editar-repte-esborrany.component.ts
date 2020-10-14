import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-editar-repte-esborrany',
  templateUrl: './editar-repte-esborrany.component.html',
  styleUrls: ['./editar-repte-esborrany.component.css']
})
export class EditarRepteEsborranyComponent implements OnInit {



  

  constructor(private fb: FormBuilder, private httpClient: HttpCommunicationService) { }

  repteForm: FormGroup;
  radioValue = 'equip';
  radioToSValue = 'hubandrock'
  currentTab: number = 0; // Current tab is set to be the first tab (0)
  numberOfTabs = 3; //0 + 1 = 2 tabs
  fotoPortada = null;
  pdfNom = null;

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;


  validationMessages = {
    'nomRepte': {
      'required': 'És un camp obligatori',
      'maxlength': 'Nom massa llarg',
      'minlength': 'Nom massa curt'
    },
    'descripcioBreuRepte': {
      'required': 'És un camp obligatori',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'descripcioDetalladaRepte': {
      'required': 'És un camp obligatori',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'fotoPortada': {
      'required': 'És un camp obligatori',
    },
    'fotoRepresentativa1': {
      'required': 'És un camp obligatori',
    },
    'fotoRepresentativa2': {
      'required': 'És un camp obligatori',
    },
    'fotoRepresentativa3': {
      'required': 'És un camp obligatori',
    },
    'videoSolucio': {

    },
    'checkboxGroup': {
      'requireCheckboxesToBeChecked': 'Selecciona almenys una categoria!'
    },
    'limitParticipants': {
      'required': 'És un camp obligatori',  //SI HA POSAT INDIVIDUAL NO CALDRIA
    },
    'dataInici': {
      'required': 'És un camp obligatori',
    },
    'dataFinalitzacio': {
      'required': 'És un camp obligatori',
    },
    'nomPremi': {
      'required': 'És un camp obligatori',
      'maxlength': 'Nom massa llarg',
      'minlength': 'Nom massa curt'
    },
    'dotacioPremi': {
      'required': 'És un camp obligatori',
      'minlength': 'Premi invàlid'
    },
    'descripcioPremi': {
      'required': 'És un camp obligatori',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'fotoPremi': {

    },
    'nomSolucio': {
      'required': 'És un camp obligatori',
      'maxlength': 'Nom massa llarg',
      'minlength': 'Nom massa curt'
    },
    'descripcioSolucio': {
      'required': 'És un camp obligatori',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'fotoSolucio': {
      'required': 'És un camp obligatori',
    },
    'nomPartner': {
      'maxlength': 'Nom massa llarg',  //Falta fer que sigui required if tal.
      'minlength': 'Nom massa curt'
    },
    'breuDescripcioPartner': {
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'logoPartner': {

    },
    'nomCognomsJurat': {
      'maxlength': 'Nom massa llarg',  //Falta fer que sigui required if tal.
      'minlength': 'Nom massa curt'
    },
    'biografiaJurat': {
      'maxlength': 'Biografia massa llarga',
      'minlength': 'Biografia massa curta'
    },
    'inputJurat': {

    },
    'pregunta': {
      'required': 'És un camp obligatori',
      'maxlength': 'Pregunta massa llarga',
      'minlength': 'Pregunta invàlida'
    },
    'resposta': {
      'required': 'És un camp obligatori.',
      'maxlength': 'Resposta massa llarga',
      'minlength': 'Resposta invàlida'
    },
    'customTOS': {  //Sha de fer required si ha triat customTOS
      'required': 'És un camp obligatori',
      'maxlength': 'Les bases legals excedeixen el màxim de caràcters',
      'minlength': 'Bases legals invàlides'
    },

  };


  formErrors = {
    'nomRepte': '',
    'descripcioBreuRepte': '',
    'descripcioDetalladaRepte': '',
    'fotoPortada': '',
    'fotoRepresentativa1': '',
    'fotoRepresentativa2': '',
    'fotoRepresentativa3': '',
    'videoSolucio': '',
    'checkboxGroup': '',
    'limitParticipants': '',
    'dataInici': '',
    'dataFinalitzacio': '',
    'nomPremi': '',
    'dotacioPremi': '',
    'descripcioPremi': '',
    'fotoPremi': '',
    'nomSolucio': '',
    'descripcioSolucio': '',
    'fotoSolucio': '',
    'nomPartner': '',
    'breuDescripcioPartner': '',
    'logoPartner': '',
    'nomCognomsJurat': '',
    'biografiaJurat': '',
    'inputJurat': '',
    'pregunta': '',
    'resposta': '',
    'customTOS': ''
  };

  ngOnInit(): void {
    this.repteForm = this.fb.group({
      nomRepte: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioBreuRepte: ['', [Validators.required, Validators.maxLength(280), Validators.minLength(3)]],
      descripcioDetalladaRepte: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      fotoPortada: ['', [Validators.required]],
      fotoRepresentativa1: ['', [Validators.required]],
      fotoRepresentativa2: ['', [Validators.required]],
      fotoRepresentativa3: ['', [Validators.required]],
      videoSolucio: [''], //validador custom youtube format
      checkboxGroup: this.fb.group({
        empresesCheckbox: [true],
        startupsCheckbox: [false],
        estudiantsCheckbox: [false],
        expertsCheckbox: [false]
      }, { validator: requireCheckboxesToBeCheckedValidator() }),
      //Com vols que t'enviem els que poden participar?, el checkbox amb diferents participants
      limitParticipants: ['', [Validators.pattern('[0-9]+')]],
      dataInici: ['', Validators.required],  //Data inici no pot ser anterior a la data actual
      dataFinalitzacio: ['', Validators.required],
      premiArray: this.fb.array([
        this.addPremiFormGroup(),
      ]),
      solucioArray: this.fb.array([
        this.addSolucioFormGroup(),
      ]),
      partnerArray: this.fb.array([
        this.addPartnerFormGroup(),
      ]),
      juratArray: this.fb.array([
        this.addJuratFormGroup(),
      ]),
      preguntaArray: this.fb.array([
        this.addPreguntaFormGroup(),
      ]),

      customTOS: ['', [Validators.maxLength(5000), Validators.minLength(3)]],  //Quina mida creus que necessitem per un Términos y condiciones?
    });

    this.subscriptionForm$ = this.repteForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.repteForm)
    });
  }


  logValidationErrors(group: FormGroup = this.repteForm): void {
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

  nextPrev(n) {
    this.currentTab = this.currentTab + n;
    this.radioValue = 'equip';
  }

  changeRadio(value) {
    this.radioValue = value;
  }

  changeRadioToS(value) {
    this.radioToSValue = value;
  }

  onFileSelected(event) {
    if (event.target.files) {

      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0])

      reader.onload = (event: any) => {
        this.fotoPortada = event.target.result
      }

    }
  }

  onPDFSelected(event) {
    console.log(event.target.files[0])
    this.pdfNom = event.target.files[0].name
  }

  addPremiFormGroup(): FormGroup {
    return this.fb.group({
      nomPremi: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      dotacioPremi: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(1)]],
      descripcioPremi: ['', [Validators.maxLength(900), Validators.minLength(3)]],
      fotoPremi: ['']
    })
  }

  addSolucioFormGroup(): FormGroup {
    return this.fb.group({
      nomSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioSolucio: ['', [Validators.required, Validators.maxLength(900), Validators.minLength(3)]],
      fotoSolucio: ['', [Validators.required]]
    })
  }

  addPartnerFormGroup(): FormGroup {
    return this.fb.group({
      nomPartner: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      breuDescripcioPartner: ['', [Validators.maxLength(900), Validators.minLength(3)]],
      logoPartner: [''],
    })
  }

  addJuratFormGroup(): FormGroup {
    return this.fb.group({
      nomCognomsJurat: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      biografiaJurat: ['', [Validators.maxLength(900), Validators.minLength(3)]],
      inputJurat: [''],
    })
  }

  addPreguntaFormGroup(): FormGroup {
    return this.fb.group({
      pregunta: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      resposta: ['', [Validators.required, Validators.maxLength(2000), Validators.minLength(3)]],
    })
  }

  addPremiButtonClick(): void {
    (<FormArray>this.repteForm.get('premiArray')).push(this.addPremiFormGroup());
  }

  addSolucioButtonClick(): void {
    (<FormArray>this.repteForm.get('solucioArray')).push(this.addSolucioFormGroup());
  }

  addPartnerButtonClick(): void {
    (<FormArray>this.repteForm.get('partnerArray')).push(this.addPartnerFormGroup());
  }

  addJuratButtonClick(): void {
    (<FormArray>this.repteForm.get('juratArray')).push(this.addJuratFormGroup());
  }

  addPreguntaButtonClick(): void {
    (<FormArray>this.repteForm.get('preguntaArray')).push(this.addPreguntaFormGroup());
  }

  removePremiButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('premiArray')).removeAt(partnerGroupIndex)
  }

  removeSolucioButtonClick(solucioGroupIndex: number): void {
    (<FormArray>this.repteForm.get('solucioArray')).removeAt(solucioGroupIndex)
  }

  removePartnerButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('partnerArray')).removeAt(partnerGroupIndex)
  }

  removeJuratButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('juratArray')).removeAt(partnerGroupIndex)
  }

  removePreguntaButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('preguntaArray')).removeAt(partnerGroupIndex)
  }

  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()

  }

  checkboxvalues() {
    console.log("CHECKBOXES")
    console.log(this.repteForm.get('checkboxGroup').value)
    console.log(this.repteForm.get('checkboxGroup').errors)
  }

  desaBorrador() {

    const formData = new FormData();
    formData.append('descripcio_short', this.repteForm.get('descripcioBreuRepte').value);
    formData.append('descripcio_long', this.repteForm.get('descripcioDetalladaRepte').value);
    formData.append('individual_equip', '1');
    formData.append('limit_participants', this.repteForm.get('limitParticipants').value);
    // formData.append('data_inici', this.repteForm.get('dataInici').value);
    // formData.append('data_final', this.repteForm.get('dataFinalitzacio').value);
    formData.append('bases_legals', '0');
    // formData.append('url_photo_video', this.repteForm.get('videoSolucio').value);
    // formData.append('url_photo_3', this.repteForm.get('fotoRepresentativa3').value);
    // formData.append('url_photo_2', this.repteForm.get('fotoRepresentativa2').value);
    // formData.append('url_photo_main', this.repteForm.get('fotoPortada').value);
    // formData.append('url_photo_1', this.repteForm.get('fotoRepresentativa1').value);
    formData.append('nom', this.repteForm.get('nomRepte').value);

    // APPENDING PREMI
    for (var i = 0; i < (<FormArray>this.repteForm.get('premiArray')).controls.length; i++) {
      if (this.repteForm.get('premiArray').value[i].nomPremi) {
        formData.append(`premi_nom[${i}]`, this.repteForm.get('premiArray').value[i].nomPremi);
      }
      if (this.repteForm.get('premiArray').value[i].dotacioPremi) {
        formData.append(`premi_dotacio[${i}]`, this.repteForm.get('premiArray').value[i].dotacioPremi);
      }
      if (this.repteForm.get('premiArray').value[i].descripcioPremi) {
        formData.append(`premi_descripcio[${i}]`, this.repteForm.get('premiArray').value[i].descripcioPremi);
      }
      if (this.repteForm.get('premiArray').value[i].fotoPremi) {
        formData.append(`premi_url_photo[${i}]`, this.repteForm.get('premiArray').value[i].fotoPremi);
      }
    }

    //APPENDING SOLUCIO
    for (var i = 0; i < (<FormArray>this.repteForm.get('solucioArray')).controls.length; i++) {
      if (this.repteForm.get('solucioArray').value[i].nomSolucio) {
        formData.append(`solucio_nom[${i}]`, this.repteForm.get('solucioArray').value[i].nomSolucio);
      }
      if (this.repteForm.get('solucioArray').value[i].descripcioSolucio) {
        formData.append(`solucio_descripcio[${i}]`, this.repteForm.get('solucioArray').value[i].descripcioSolucio);
      }
      if (this.repteForm.get('solucioArray').value[i].fotoSolucio) {
        formData.append(`solucio_url_photo[${i}]`, this.repteForm.get('solucioArray').value[i].fotoSolucio);
      }
    }

    //APPENDING PARTNER
    for (var i = 0; i < (<FormArray>this.repteForm.get('partnerArray')).controls.length; i++) {
      if (this.repteForm.get('partnerArray').value[i].nomPartner) {
        formData.append(`partner_nom[${i}]`, this.repteForm.get('partnerArray').value[i].nomPartner);
      }
      if (this.repteForm.get('partnerArray').value[i].breuDescripcioPartner) {
        formData.append(`partner_descripcio[${i}]`, this.repteForm.get('partnerArray').value[i].breuDescripcioPartner);
      }
      if (this.repteForm.get('partnerArray').value[i].logoPartner) {
        formData.append(`partner_url_logo[${i}]`, this.repteForm.get('partnerArray').value[i].logoPartner);
      }
    }

    //APPENDING JURAT
    for (var i = 0; i < (<FormArray>this.repteForm.get('juratArray')).controls.length; i++) {
      if (this.repteForm.get('juratArray').value[i].nomCognomsJurat) {
        formData.append(`jurat_nom[${i}]`, this.repteForm.get('juratArray').value[i].nomCognomsJurat);
      }
      if (this.repteForm.get('juratArray').value[i].biografiaJurat) {
        formData.append(`jurat_bio[${i}]`, this.repteForm.get('juratArray').value[i].biografiaJurat);
      }
      if (this.repteForm.get('juratArray').value[i].inputJurat) {
        formData.append(`jurat_url_photo[${i}]`, this.repteForm.get('juratArray').value[i].inputJurat);
      }
    }

    //APPENDING FAQ
    for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
      if (this.repteForm.get('preguntaArray').value[i].pregunta) {
        formData.append(`faq_pregunta[${i}]`, this.repteForm.get('preguntaArray').value[i].pregunta);
      }
      if (this.repteForm.get('preguntaArray').value[i].resposta) {
        formData.append(`faq_resposta[${i}]`, this.repteForm.get('preguntaArray').value[i].resposta);
      }
    }

    //APENDING RECURSOS
    // for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
    //   formData.append(`recurs_nom[${i}]`, this.repteForm.get('preguntaArray').value[i].pregunta);
    //   formData.append(`recurs_url_fitxer[${i}]`, this.repteForm.get('preguntaArray').value[i].resposta);
    // }



    this.subscriptionHttp1$ = this.httpClient.addRepteBorrador(formData)
      .pipe(first())
      .subscribe(
        data => {
          console.log("HOLAOL")
          console.log(data);
        },
        error => {
          console.log("Fail")
        });

  }


  onRepteSubmit() {

    const formData = new FormData();
    formData.append('descripcio_short', this.repteForm.get('descripcioBreuRepte').value);
    formData.append('descripcio_long', this.repteForm.get('descripcioDetalladaRepte').value);
    formData.append('individual_equip', '1');
    formData.append('limit_participants', this.repteForm.get('limitParticipants').value);
    formData.append('data_inici', '20/10/2020');
    formData.append('data_final', '21/10/2020');
    formData.append('bases_legals', '0');
    formData.append('url_photo_video', this.repteForm.get('videoSolucio').value);
    formData.append('url_photo_3', this.repteForm.get('fotoRepresentativa3').value);
    formData.append('url_photo_2', this.repteForm.get('fotoRepresentativa2').value);
    formData.append('url_photo_main', this.repteForm.get('fotoPortada').value);
    formData.append('url_photo_1', this.repteForm.get('fotoRepresentativa1').value);
    formData.append('nom', this.repteForm.get('nomRepte').value);

    //APPENDING PREMI
    for (var i = 0; i < (<FormArray>this.repteForm.get('premiArray')).controls.length; i++) {
      formData.append(`premi_nom[${i}]`, this.repteForm.get('premiArray').value[i].nomPremi);
      formData.append(`premi_dotacio[${i}]`, this.repteForm.get('premiArray').value[i].dotacioPremi);
      formData.append(`premi_descripcio[${i}]`, this.repteForm.get('premiArray').value[i].descripcioPremi);
      formData.append(`premi_url_photo[${i}]`, this.repteForm.get('premiArray').value[i].fotoPremi);
    }

    //APPENDING SOLUCIO
    for (var i = 0; i < (<FormArray>this.repteForm.get('solucioArray')).controls.length; i++) {
      formData.append(`solucio_nom[${i}]`, this.repteForm.get('solucioArray').value[i].nomSolucio);
      formData.append(`solucio_descripcio[${i}]`, this.repteForm.get('solucioArray').value[i].descripcioSolucio);
      formData.append(`solucio_url_photo[${i}]`, this.repteForm.get('solucioArray').value[i].fotoSolucio);
    }

    //APPENDING PARTNER
    for (var i = 0; i < (<FormArray>this.repteForm.get('partnerArray')).controls.length; i++) {
      formData.append(`partner_nom[${i}]`, this.repteForm.get('partnerArray').value[i].nomPartner);
      formData.append(`partner_descripcio[${i}]`, this.repteForm.get('partnerArray').value[i].breuDescripcioPartner);
      formData.append(`partner_url_logo[${i}]`, this.repteForm.get('partnerArray').value[i].logoPartner);
    }

    //APPENDING JURAT
    for (var i = 0; i < (<FormArray>this.repteForm.get('juratArray')).controls.length; i++) {
      formData.append(`jurat_nom[${i}]`, this.repteForm.get('juratArray').value[i].nomCognomsJurat);
      formData.append(`jurat_bio[${i}]`, this.repteForm.get('juratArray').value[i].biografiaJurat);
      formData.append(`jurat_url_photo[${i}]`, this.repteForm.get('juratArray').value[i].inputJurat);
    }

    //APPENDING FAQ
    for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
      formData.append(`faq_pregunta[${i}]`, this.repteForm.get('preguntaArray').value[i].pregunta);
      formData.append(`faq_resposta[${i}]`, this.repteForm.get('preguntaArray').value[i].resposta);
    }

    //APENDING RECURSOS
    // for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
    //   formData.append(`faq_pregunta[${i}]`, 'idskfjwoeoiwjfiowefoiwejfijfoiwjfiowjfioewjfoiwjfiowjefiojf');
    //   formData.append(`faq_resposta[${i}]`, 'slkdowiejfoiwejfoiwjeofjwoiejfoiwjeifojweijfowiejfoiwjefjf');
    // }



    this.subscriptionHttp1$ = this.httpClient.addRepteRevisio(formData)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log("Fail")
        });

  }
}

function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxesToBeChecked: true,
      };
    }

    return null;
  };
}