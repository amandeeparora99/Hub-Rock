import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-creacio-repte',
  templateUrl: './creacio-repte.component.html',
  styleUrls: ['./creacio-repte.component.css']
})
export class CreacioRepteComponent implements OnInit {



  constructor(private fb: FormBuilder, private httpClient: HttpCommunicationService, public datepipe: DatePipe) { }

  repteForm: FormGroup;
  radioValue = 'equip';
  radioToSValue = 'hubandrock'
  currentTab: number = 0; // Current tab is set to be the first tab (0)
  numberOfTabs = 3; //0 + 1 = 2 tabs
  fotoPortada = null;
  pdfNom = null;

  fotoRepte1Selected = "";
  fotoRepte2Selected = "";
  fotoRepte3Selected = "";

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;

  @ViewChild('inputFile') myInputVariable: ElementRef;


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
      'maxlength': 'Enllaç massa llarg',
      'minlength': 'Enllaç massa curt'
    },
    'checkboxGroup': {
      'requireCheckboxesToBeChecked': 'Selecciona almenys una categoria!'
    },
    'limitParticipants': {
      'required': 'És un camp obligatori',  //SI HA POSAT INDIVIDUAL NO CALDRIA
    },
    'dataInici': {
      'required': 'És un camp obligatori',
      'menorquefinal': 'La data d\'inici no pot ser major que la final',
      'dateGreaterThan': 'La data d\'inici no pot ser posterior a la final'
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
      videoSolucio: ['', [Validators.minLength(3), Validators.maxLength(255)]], //validador custom youtube format
      checkboxGroup: this.fb.group({
        empresesCheckbox: [true],
        startupsCheckbox: [false],
        estudiantsCheckbox: [false],
        expertsCheckbox: [false]
      }, { validator: requireCheckboxesToBeCheckedValidator() }),
      //Com vols que t'enviem els que poden participar?, el checkbox amb diferents participants
      limitParticipants: ['', [Validators.pattern('[0-9]+')]],
      dataInici: ['', Validators.required, dateGreaterThan],  //Data inici no pot ser anterior a la data actual
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

  fotosRepteSelected(event, numFoto) {
    if (event.target.files) {
      if (numFoto == 1) {
        this.fotoRepte1Selected = "../../assets/simpleicons/tic.png";
      }
      else if (numFoto == 2) {
        this.fotoRepte2Selected = "../../assets/simpleicons/tic.png";
      }
      else if (numFoto == 3) {
        this.fotoRepte3Selected = "../../assets/simpleicons/tic.png";
      }
    }
  }

  reset() {
    this.myInputVariable.nativeElement.value = '';
    this.fotoRepte1Selected = '';
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
    console.log(this.repteForm.get('checkboxGroup').value.empresesCheckbox)
  }

  appendRepte(): FormData {

    const formData = new FormData();

    if (this.repteForm.get('descripcioBreuRepte').value) {
      formData.append('descripcio_short', this.repteForm.get('descripcioBreuRepte').value);
    }

    if (this.repteForm.get('descripcioDetalladaRepte').value) {
      formData.append('descripcio_long', this.repteForm.get('descripcioDetalladaRepte').value);
    }

    if (this.repteForm.get('nomRepte').value) {
      formData.append('nom', this.repteForm.get('nomRepte').value);
    }

    if (this.repteForm.get('videoSolucio').value) {
      formData.append('url_photo_video', this.repteForm.get('videoSolucio').value);

    }

    if (this.radioValue == "equip" && this.repteForm.get('limitParticipants').value) {
      formData.append('individual_equip', '1')
      formData.append('limit_participants', this.repteForm.get('limitParticipants').value)

    } else {
      formData.append('individual_equip', '0');

    }

    if (this.radioToSValue == "custom" && this.repteForm.get('customTOS').value) {
      formData.append('bases_legals', '1')
      formData.append('bases_legals_personals', this.repteForm.get('customTOS').value)
    } else {
      formData.append('bases_legals', '0');
    }

    if (this.repteForm.get('dataInici').value) {
      let iniciDate = this.datepipe.transform(this.repteForm.get('dataInici').value, 'dd/MM/yyyy')
      formData.append('data_inici', iniciDate)
    }

    if (this.repteForm.get('dataFinalitzacio').value) {
      let finalDate = this.datepipe.transform(this.repteForm.get('dataFinalitzacio').value, 'dd/MM/yyyy')
      formData.append('data_final', finalDate)
    }

    formData.append('participants[\"empreses\"]', this.repteForm.get('checkboxGroup').value.empresesCheckbox)
    formData.append('participants[\"startups\"]', this.repteForm.get('checkboxGroup').value.startupsCheckbox)
    formData.append('participants[\"estudiants\"]', this.repteForm.get('checkboxGroup').value.estudiantsCheckbox)
    formData.append('participants[\"experts\"]', this.repteForm.get('checkboxGroup').value.expertsCheckbox)

    // APPENDING PREMI
    for (var i = 0; i < (<FormArray>this.repteForm.get('premiArray')).controls.length; i++) {
      if (this.repteForm.get('premiArray').value[i].nomPremi) {
        formData.append(`premi_nom[${i}]`, this.repteForm.get('premiArray').value[i].nomPremi);
      }
      if (this.repteForm.get('premiArray').value[i].dotacioPremi.value) {
        formData.append(`premi_dotacio[${i}]`, this.repteForm.get('premiArray').value[i].dotacioPremi);
      }
      if (this.repteForm.get('premiArray').value[i].descripcioPremi.value) {
        formData.append(`premi_descripcio[${i}]`, this.repteForm.get('premiArray').value[i].descripcioPremi);
      }
      if (this.repteForm.get('premiArray').value[i].fotoPremi.value) {
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

    // APENDING RECURSOS
    // for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
    //   formData.append(`recurs_nom[${i}]`, this.repteForm.get('preguntaArray').value[i].pregunta);
    //   formData.append(`recurs_url_fitxer[${i}]`, this.repteForm.get('preguntaArray').value[i].resposta);
    // }
    return formData;
  }

  desaBorrador() {

    if (!this.repteForm.get('nomRepte').value) {

      if (!this.formErrors.nomRepte) {
        this.formErrors.nomRepte += this.validationMessages.nomRepte.required + ' ';
      }

    } else if (this.repteForm.get('nomRepte').value.length < 3) {

      if (!this.formErrors.nomRepte) {
        this.formErrors.nomRepte += this.validationMessages.nomRepte.minlength + ' ';

      }

    } else if (this.repteForm.get('nomRepte').value.length > 255) {

      if (!this.formErrors.nomRepte) {
        this.formErrors.nomRepte += this.validationMessages.nomRepte.maxlength + ' ';

      }

    } else {
      let formData: any = this.appendRepte();

      // for (var value of formData.values()) {
      //   console.log(value);
      // }

      this.subscriptionHttp1$ = this.httpClient.addRepteBorrador(formData)
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


  onRepteSubmit() {
    if (!this.repteForm.valid) {

      this.logValidationErrorsUntouched()
    } else {
      let formData = this.appendRepte();

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



    // //APPENDING PREMI
    // for (var i = 0; i < (<FormArray>this.repteForm.get('premiArray')).controls.length; i++) {
    //   formData.append(`premi_nom[${i}]`, this.repteForm.get('premiArray').value[i].nomPremi);
    //   formData.append(`premi_dotacio[${i}]`, this.repteForm.get('premiArray').value[i].dotacioPremi);
    //   formData.append(`premi_descripcio[${i}]`, this.repteForm.get('premiArray').value[i].descripcioPremi);
    //   formData.append(`premi_url_photo[${i}]`, this.repteForm.get('premiArray').value[i].fotoPremi);
    // }

    // //APPENDING SOLUCIO
    // for (var i = 0; i < (<FormArray>this.repteForm.get('solucioArray')).controls.length; i++) {
    //   formData.append(`solucio_nom[${i}]`, this.repteForm.get('solucioArray').value[i].nomSolucio);
    //   formData.append(`solucio_descripcio[${i}]`, this.repteForm.get('solucioArray').value[i].descripcioSolucio);
    //   formData.append(`solucio_url_photo[${i}]`, this.repteForm.get('solucioArray').value[i].fotoSolucio);
    // }

    // //APPENDING PARTNER
    // for (var i = 0; i < (<FormArray>this.repteForm.get('partnerArray')).controls.length; i++) {
    //   formData.append(`partner_nom[${i}]`, this.repteForm.get('partnerArray').value[i].nomPartner);
    //   formData.append(`partner_descripcio[${i}]`, this.repteForm.get('partnerArray').value[i].breuDescripcioPartner);
    //   formData.append(`partner_url_logo[${i}]`, this.repteForm.get('partnerArray').value[i].logoPartner);
    // }

    // //APPENDING JURAT
    // for (var i = 0; i < (<FormArray>this.repteForm.get('juratArray')).controls.length; i++) {
    //   formData.append(`jurat_nom[${i}]`, this.repteForm.get('juratArray').value[i].nomCognomsJurat);
    //   formData.append(`jurat_bio[${i}]`, this.repteForm.get('juratArray').value[i].biografiaJurat);
    //   formData.append(`jurat_url_photo[${i}]`, this.repteForm.get('juratArray').value[i].inputJurat);
    // }

    // //APPENDING FAQ
    // for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
    //   formData.append(`faq_pregunta[${i}]`, this.repteForm.get('preguntaArray').value[i].pregunta);
    //   formData.append(`faq_resposta[${i}]`, this.repteForm.get('preguntaArray').value[i].resposta);
    // }

    // //APENDING RECURSOS
    // // for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
    // //   formData.append(`faq_pregunta[${i}]`, 'idskfjwoeoiwjfiowefoiwejfijfoiwjfiowjfioewjfoiwjfiowjefiojf');
    // //   formData.append(`faq_resposta[${i}]`, 'slkdowiejfoiwejfoiwjeofjwoiejfoiwjeifojweijfowiejfoiwjefjf');
    // // }





  }

  logValidationErrorsUntouched(group: FormGroup = this.repteForm): void {
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
}


function dateGreaterThan(control: AbstractControl): { [key: string]: boolean } | null {

  if (this.repteForm.get('dataFinalitzacio').value && this.repteForm.get('dataFinalitzacio').value) {

    let dataFinal = new Date(this.repteForm.get('dataFinalitzacio').value);
    let dataInici = new Date(this.repteForm.get('dataInici').value);

    if (dataInici > dataFinal) {
      return { 'dateGreaterThan': true }
    }
  }

  return null;

};


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