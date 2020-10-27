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
  usuariForm: FormGroup;
  radioValue = 'equip';
  radioToSValue = 'hubandrock';
  currentTab: number = 0; // Current tab is set to be the first tab (0)
  numberOfTabs = 3; //0 + 1 = 2 tabs

  objectFotosPreview: any = {};

  fotoPortada = null;
  pdfArray;
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
    'videoSolucio': {
      'maxlength': 'Enllaç massa llarg',
      'minlength': 'Enllaç massa curt'
    },
    'checkboxGroup': {
      'requireCheckboxesToBeChecked': 'Selecciona almenys una categoria!'
    },
    'datesGroup': {
      'dataIniciBiggerThanFinal': 'El repte no pot acabar abans de començar!'
    },
    'limitParticipants': {
      'pattern': 'Entra un nombre de participants vàlid',
    },
    'dataInici': {
      'required': 'És un camp obligatori',
      'dateShorterThanToday': 'La data no pot ser inferior a avui'
    },
    'dataFinalitzacio': {
      'required': 'És un camp obligatori',
      'dateShorterThanToday': 'La data no pot ser inferior a avui'
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
    'fotoJurat': {

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

    'campsErronis': {
      'errors': 'Hi ha camps erronis, comprova que el formulari estigui omplert correctament'
    }

  };


  formErrors = {
    'nomRepte': '',
    'descripcioBreuRepte': '',
    'descripcioDetalladaRepte': '',
    'fotoPortada': '',
    'videoSolucio': '',
    'checkboxGroup': '',
    'limitParticipants': '',
    'datesGroup': '',
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
    'fotoJurat': '',
    'pregunta': '',
    'resposta': '',
    'customTOS': '',
    'campsErronis': '',
  };

  ngOnInit(): void {
    this.repteForm = this.fb.group({
      nomRepte: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioBreuRepte: ['', [Validators.required, Validators.maxLength(280), Validators.minLength(3)]],
      descripcioDetalladaRepte: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      fotoPortada: ['',
        // [Validators.required]
      ],
      fotoRepresentativa1: ['', []],
      fotoRepresentativa2: ['', []],
      fotoRepresentativa3: ['', []],
      pdf: [''],
      videoSolucio: ['', [Validators.minLength(3), Validators.maxLength(255)]], //validador custom youtube format
      checkboxGroup: this.fb.group({
        empresesCheckbox: [true],
        startupsCheckbox: [false],
        estudiantsCheckbox: [false],
        expertsCheckbox: [false]
      }, { validator: requireCheckboxesToBeCheckedValidator() }),
      //Com vols que t'enviem els que poden participar?, el checkbox amb diferents participants
      limitParticipants: ['', Validators.pattern('[0-9]+')],
      datesGroup: this.fb.group({
        dataInici: ['', [Validators.required, dateShorterThanToday]],  //Data inici no pot ser anterior a la data actual
        dataFinalitzacio: ['', [Validators.required, dateShorterThanToday]],
      }, { validator: dataIniciBiggerThanFinal() }),
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


  getInterpolationCondition(name, i) {
    let stringInterpolation: string = name + i

    if (this.objectFotosPreview[stringInterpolation]) {
      return true;
    } else {
      return false;
    }
  }

  getObjectProperty(name, i) {
    let stringInterpolation: string = name + i

    return this.objectFotosPreview[stringInterpolation];
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

      if (abstractControl instanceof FormArray) {

        if (abstractControl == this.repteForm.get('partnerArray')) {

          for (let control of (<FormArray>this.repteForm.get('partnerArray')).controls) {
            if (control instanceof FormGroup) {

              if (control.controls.nomPartner.value ||
                control.controls.breuDescripcioPartner.value ||
                control.controls.logoPartner.value) {

                control.controls.nomPartner.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomPartner.updateValueAndValidity({ emitEvent: false })


                control.controls.breuDescripcioPartner.setValidators([Validators.required, Validators.maxLength(900), Validators.minLength(3)])
                control.controls.breuDescripcioPartner.updateValueAndValidity({ emitEvent: false })


                control.controls.logoPartner.setValidators([Validators.required])
                control.controls.logoPartner.updateValueAndValidity({ emitEvent: false })

                control.updateValueAndValidity({ emitEvent: false });
              }
              else {

                control.controls.nomPartner.setValidators([Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomPartner.updateValueAndValidity({ emitEvent: false })


                control.controls.breuDescripcioPartner.setValidators([Validators.maxLength(900), Validators.minLength(3)])
                control.controls.breuDescripcioPartner.updateValueAndValidity({ emitEvent: false })


                control.controls.logoPartner.clearValidators()
                control.controls.logoPartner.updateValueAndValidity({ emitEvent: false })

                control.updateValueAndValidity({ emitEvent: false });

              }
            }
          }

        }
        else if (abstractControl == this.repteForm.get('juratArray')) {

          for (let control of (<FormArray>this.repteForm.get('juratArray')).controls) {
            if (control instanceof FormGroup) {

              if (control.controls.nomCognomsJurat.value ||
                control.controls.biografiaJurat.value ||
                control.controls.fotoJurat.value) {

                control.controls.nomCognomsJurat.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomCognomsJurat.updateValueAndValidity({ emitEvent: false })


                control.controls.biografiaJurat.setValidators([Validators.required, Validators.maxLength(900), Validators.minLength(3)])
                control.controls.biografiaJurat.updateValueAndValidity({ emitEvent: false })


                control.controls.fotoJurat.setValidators([Validators.required])
                control.controls.fotoJurat.updateValueAndValidity({ emitEvent: false })

                control.updateValueAndValidity({ emitEvent: false });

              } else {

                control.controls.nomCognomsJurat.setValidators([Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomCognomsJurat.updateValueAndValidity({ emitEvent: false })


                control.controls.biografiaJurat.setValidators([Validators.maxLength(900), Validators.minLength(3)])
                control.controls.biografiaJurat.updateValueAndValidity({ emitEvent: false })


                control.controls.fotoJurat.clearValidators()
                control.controls.fotoJurat.updateValueAndValidity({ emitEvent: false })

                control.updateValueAndValidity({ emitEvent: false });

              }
            }
          }
        }
      }

    })

  }

  todayDate() {
    let today = new Date();
    let todayFormat = this.datepipe.transform(today, 'yyyy-MM-dd');

    return todayFormat;
  }

  tomorrowDate() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let tomorrowFormat = this.datepipe.transform(tomorrow, 'yyyy-MM-dd');

    return tomorrowFormat;
  }

  nextPrev(n) {
    this.currentTab = this.currentTab + n;
  }

  changeRadio(value) {
    this.radioValue = value;

  }

  changeRadioToS(value) {
    this.radioToSValue = value;
  }

  onPdfSelected(event) {
    if (event.target.files) {
      console.log(event.target, event.target.files)
      this.pdfArray = event.target.files
      // console.log(this.solucioForm.get('pdf').value)
      // Array.from(this.pdfArray).forEach(file => {
      //   console.log(file)
      // });

    }
  }

  resetPdfArray() {
    this.pdfArray = null;
  }

  onFileSelected(event, index?) {
    //FER UN OBJECTE DE PREVIEWS I UN DE FILES

    if (event.target.files) {
      console.log(event.target.files)
      let inputName = event.target.name;
      console.log(inputName, index)

      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0])

      reader.onload = (event: any) => {

        this.objectFotosPreview[inputName] = reader.result

      }

    }
    console.log(this.objectFotosPreview)


  }
  ensenyarObjecte() {
    console.log(this.objectFotosPreview)
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

  eliminarFoto(fotoName) {
    console.log("INSIDEEEEEEEEEEEEEEEEEE TOOOOOOOOOOOOOO DEEEEEEEEEEEPPPPPPPPPP", fotoName)
    delete this.objectFotosPreview[fotoName]
  }

  eliminarFotoArray(fotoName) {
    let str = fotoName;

    //Separem el nom de foto
    let arraySplit = str.split(/([0-9]+)/)  //fotoPremi
    let number = Number(arraySplit[1]);  //0
  
    this.loopObjectFotosPreview(number, arraySplit[0]);

    str = number.toString()
    let stringFinal = arraySplit[0] + str;

  }


  loopObjectFotosPreview(number, valueName) {

    console.log("FOTOPREMI QUE VOLEM ELIMINAR:" + valueName + number);
    let arrayLength = Object.keys(this.objectFotosPreview).length - 1

    for (const [key, value] of Object.entries(this.objectFotosPreview)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectFotosPreview[stringRestada] = this.objectFotosPreview[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectFotosPreview[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectFotosPreview)

  }

  reset() {
    this.myInputVariable.nativeElement.value = '';
    this.fotoRepte1Selected = '';
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
      fotoJurat: [''],
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

    if (this.radioValue == "equip") {

      formData.append('individual_equip', '1')

      if (this.repteForm.get('limitParticipants').value) {

        formData.append('limit_participants', this.repteForm.get('limitParticipants').value)

      } else {

        formData.append('limit_participants', ' ')

      }

    } else {
      formData.append('individual_equip', '0');

    }

    if (this.radioToSValue == "custom") {
      formData.append('bases_legals', '1')
      if (this.repteForm.get('customTOS').value) {
        formData.append('bases_legals_personals', this.repteForm.get('customTOS').value)
      }
    } else {
      formData.append('bases_legals', '0');
    }

    if (this.repteForm.get('datesGroup').get('dataInici').value) {
      let iniciDate = this.datepipe.transform(this.repteForm.get('datesGroup').get('dataInici').value, 'dd/MM/yyyy')
      formData.append('data_inici', iniciDate)
    }

    if (this.repteForm.get('datesGroup').get('dataFinalitzacio').value) {
      let finalDate = this.datepipe.transform(this.repteForm.get('datesGroup').get('dataFinalitzacio').value, 'dd/MM/yyyy')
      formData.append('data_final', finalDate)
    }

    formData.append('participants[empreses]', (this.repteForm.get('checkboxGroup').value.empresesCheckbox))
    formData.append('participants[startups]', this.repteForm.get('checkboxGroup').value.startupsCheckbox)
    formData.append('participants[estudiants]', this.repteForm.get('checkboxGroup').value.estudiantsCheckbox)
    formData.append('participants[experts]', this.repteForm.get('checkboxGroup').value.expertsCheckbox)

    // APPENDING FOTOS REPTE
    if (this.objectFotosPreview.fotoPortada) {
      console.log('appending url photo main amb ', this.objectFotosPreview.fotoPortada)
      formData.append('url_photo_main', this.objectFotosPreview.fotoPortada)
    }

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
      if (this.repteForm.get('juratArray').value[i].fotoJurat) {
        formData.append(`jurat_url_photo[${i}]`, this.repteForm.get('juratArray').value[i].fotoJurat);
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

    //APPENDING RECURSOS
    if (this.pdfArray) {
      for (let index = 0; index < this.pdfArray.length; index++) {
        const file = this.pdfArray[index];

        formData.append(`recurs_nom[${index}]`, file.name);
        formData.append(`recurs_url_fitxer[${index}]`, file);
      }
    }

    return formData;
  }

  desaBorrador() {

    if (!this.repteForm.get('nomRepte').value) {

      if (!this.formErrors.nomRepte) {
        this.formErrors.nomRepte += this.validationMessages.nomRepte.required + ' ';
      }

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

    } else if (this.repteForm.get('nomRepte').value.length < 3) {

      if (!this.formErrors.nomRepte) {
        this.formErrors.nomRepte += this.validationMessages.nomRepte.minlength + ' ';
      }

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

    } else if (this.repteForm.get('nomRepte').value.length > 255) {

      if (!this.formErrors.nomRepte) {
        this.formErrors.nomRepte += this.validationMessages.nomRepte.maxlength + ' ';
      }

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

    } else {

      if (this.formErrors.campsErronis) {
        this.formErrors.campsErronis = '';
      }

      let formData: any = this.appendRepte();

      for (var value of formData.values()) {
        console.log(value);
      }

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
      console.log(this.repteForm.valid)
      for (const field in this.repteForm.controls) { // 'field' is a string
        const control = this.repteForm.get(field).errors; // 'control' is a FormControl  
        console.log(field, control)
      }
      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

      this.logValidationErrorsUntouched()

    } else {
      if (this.formErrors.campsErronis) {
        this.formErrors.campsErronis = '';
      }

      let formData: any = this.appendRepte();

      for (var value of formData.values()) {
        console.log(value);
      }

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


// function dateGreaterThan(control: AbstractControl): { [key: string]: boolean } | null {

//   if (this.repteForm.get('dataFinalitzacio').value && this.repteForm.get('dataFinalitzacio').value) {

//     let dataFinal = new Date(this.repteForm.get('dataFinalitzacio').value);
//     let dataInici = new Date(this.repteForm.get('dataInici').value);

//     if (dataInici > dataFinal) {
//       return { 'dateGreaterThan': true }
//     }
//   }

//   return null;

// };


function dateShorterThanToday(control: AbstractControl): { [key: string]: any } | null {
  let date = new Date(control.value);
  let currentDate = new Date();

  if (date.getDate() > currentDate.getDate() || dateString(date) == dateString(currentDate)) {
    return null;
  }
  else {
    return { dataInici: true }
  }
}



function dateString(date) {
  var any = date.getFullYear();
  var mes = date.getMonth() + 1;
  var dia = date.getDate();

  return dia + "/" + mes + "/" + any
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

function dataIniciBiggerThanFinal(): ValidatorFn {
  return function validate(form: FormGroup) {
    let startDate = new Date(form.value.dataInici);
    let endDate = new Date(form.value.dataFinalitzacio);

    if (startDate >= endDate) {
      return {
        dataIniciBiggerThanFinal: true
      };
    }

    return null;
  };
}
