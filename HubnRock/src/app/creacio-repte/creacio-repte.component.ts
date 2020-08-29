import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      nomRepte: ['', Validators.required],
      descripcioBreuRepte: ['', Validators.required],
      descripcioDetalladaRepte: [''],
      fotoPortada: ['', Validators.required],
      fotoRepresentativa1: ['', Validators.required],
      fotoRepresentativa2: ['', Validators.required],
      fotoRepresentativa3: ['', Validators.required],
      videoSolucio: [''],
      //Falta els checkbox
      limitParticipants: [''],
      dataInici: ['', Validators.required],
      dataFinalitzacio: ['', Validators.required],
      nomPremi: ['', Validators.required],
      dotacioPremi: ['', Validators.required],
      descripcioPremi: [''],
      fotoPremi: [''],
      nomSolucio: ['', Validators.required],
      descripcioSolucio: ['', Validators.required],
      fotoSolucio: ['', Validators.required],
      nomPartner: [''],
      breuDescripcioPartner: [''],
      logoPartner: [''],
      nomCognomsJurat: [''],
      biografiaJurat: [''],
      inputJurat: [''],
      pregunta: ['', Validators.required],
      resposta: ['', Validators.required],
      customTOS: [''],
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

  changeRadio(value){
    this.radioValue = value;
  }

  changeRadioToS(value){
    this.radioToSValue = value;
  }

}
