import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-creacio-repte',
  templateUrl: './creacio-repte.component.html',
  styleUrls: ['./creacio-repte.component.css']
})
export class CreacioRepteComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  repteForm: FormGroup;
  radioValue = 'equip';
  radioToSValue = 'hubandrock'
  currentTab: number = 0; // Current tab is set to be the first tab (0)
  numberOfTabs = 3; //0 + 1 = 2 tabs
  fotoPortada = null;
  pdfNom = null;



  validationMessages = {
    'nomRepte': {
      'required': 'És un camp obligatori.'
    },
    'descripcioBreuRepte': {
      'required': 'És un camp obligatori.',
    },
    'descripcioDetalladaRepte': {
      'required': 'És un camp obligatori.',
    },
    'fotoPortada': {
      'required': 'És un camp obligatori.',
    },
    'fotoRepresentativa1': {
      'required': 'És un camp obligatori.',
    },
    'fotoRepresentativa2': {
      'required': 'És un camp obligatori.',
    },
    'fotoRepresentativa3': {
    },
    'videoSolucio': {
      'required': 'És un camp obligatori.',
    },
    'limitParticipants': {
      'required': 'És un camp obligatori.',
    },
    'dataInici': {
      'required': 'És un camp obligatori.',
    },
    'dataFinalitzacio': {
      'required': 'És un camp obligatori.',
    },
    'nomPremi': {
      'required': 'És un camp obligatori.',
    },
    'dotacioPremi': {
      'required': 'És un camp obligatori.',
    },
    'descripcioPremi': {
      'required': 'És un camp obligatori.',
    },
    'fotoPremi': {
      'required': 'És un camp obligatori.',
    },
    'nomSolucio': {
      'required': 'És un camp obligatori.',
    },
    'descripcioSolucio': {
      'required': 'És un camp obligatori.',
    },
    'fotoSolucio': {
      'required': 'És un camp obligatori.',
    },
    'nomPartner': {
      'required': 'És un camp obligatori.',
    },
    'breuDescripcioPartner': {
      'required': 'És un camp obligatori.',
    },
    'logoPartner': {
      'required': 'És un camp obligatori.',
    },
    'nomCognomsJurat': {
      'required': 'És un camp obligatori.',
    },
    'biografiaJurat': {
      'required': 'És un camp obligatori.',
    },
    'inputJurat': {
      'required': 'És un camp obligatori.',
    },
    'pregunta': {
      'required': 'És un camp obligatori.',
    },
    'resposta': {
      'required': 'És un camp obligatori.',
    },
    'customTOS': {
      'required': 'És un camp obligatori.',
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
      //Falta els checkbox
      //Com vols que t'enviem els que poden participar?, el checkbox amb diferents participants
      limitParticipants: ['', [Validators.pattern('[0-9]+')]],
      dataInici: ['', Validators.required],  //Data inici no pot ser anterior a la data actual
      dataFinalitzacio: ['', Validators.required],
      nomPremi: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      dotacioPremi: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(1)]], //Preu
      descripcioPremi: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      fotoPremi: [''],
      solucioArray: this.fb.array([
        this.addSolucioFormGroup(),
      ]),
      partnerArray: this.fb.array([
        this.addPartnerFormGroup(),
      ]),
      nomCognomsJurat: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      biografiaJurat: ['', [Validators.maxLength(500), Validators.minLength(3)]],
      inputJurat: [''],
      pregunta: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      resposta: ['', [Validators.required, Validators.maxLength(2000), Validators.minLength(3)]], //
      customTOS: ['', [Validators.maxLength(5000), Validators.minLength(3)]],  //Quina mida creus que necessitem per un Términos y condiciones?
    });

    this.repteForm.valueChanges.subscribe((data) => {
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

  addSolucioFormGroup(): FormGroup {
    return this.fb.group({
      nomSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      fotoSolucio: ['', [Validators.required]]
    })
  }

  addPartnerFormGroup(): FormGroup {
    return this.fb.group({
      nomPartner: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      breuDescripcioPartner: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      logoPartner: [''],
    })
  }

  addSolucioButtonClick(): void {
    (<FormArray>this.repteForm.get('solucioArray')).push(this.addSolucioFormGroup());
  }

  addPartnerButtonClick(): void {
    (<FormArray>this.repteForm.get('partnerArray')).push(this.addPartnerFormGroup());
  }

  removeSolucioButtonClick(solucioGroupIndex: number): void {
    (<FormArray>this.repteForm.get('solucioArray')).removeAt(solucioGroupIndex)
  }

  removePartnerButtonClick(partnerGroupIndex: number): void {
    console.log("Deleting");
    (<FormArray>this.repteForm.get('partnerArray')).removeAt(partnerGroupIndex)
  }
}
