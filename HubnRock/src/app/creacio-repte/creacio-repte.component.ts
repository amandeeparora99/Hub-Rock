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
    'nomSolucio': {
      'required': 'És un camp obligatori.'
    },
    'descripcioBreuSolucio': {
      'required': 'És un camp obligatori.',
    },
    'problemaSolucio': {
      'required': 'És un camp obligatori.',
    },
    'descripcioSolucio': {
      'required': 'És un camp obligatori.',
    },
    'innovadoraSolucio': {
      'required': 'És un camp obligatori.',
    },
    'faseSolucio': {
      'required': 'És un camp obligatori.',
    },
    'videoSolucio': {
    },
    'nomEquip': {
      'required': 'És un camp obligatori.',
    },
    'nomICognomsMembre': {
      'required': 'És un camp obligatori.',
    },
    'posicioMembre': {
      'required': 'És un camp obligatori.',
    },
    'linkMembre': {
    }
  };


  formErrors = {

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
    });
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
