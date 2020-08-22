import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-solucio',
  templateUrl: './solucio.component.html',
  styleUrls: ['./solucio.component.css']
})
export class SolucioComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  solucioForm: FormGroup;
  radioValue;
  currentTab: number; // Current tab is set to be the first tab (0)
  numberOfTabs = 1; //0 + 1 = 2 tabs

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
    }
  };


  formErrors = {
    'nomSolucio': '',
    'descripcioBreuSolucio': '',
    'problemaSolucio': '',
    'descripcioSolucio': '',
    'innovadoraSolucio': '',
    'faseSolucio': '',
    'videoSolucio': ''
  };


  ngOnInit(): void {
    this.solucioForm = this.fb.group({
      nomSolucio: ['', Validators.required],
      descripcioBreuSolucio: ['', Validators.required],
      problemaSolucio: ['', Validators.required],
      descripcioSolucio: ['', Validators.required],
      innovadoraSolucio: ['', Validators.required],
      faseSolucio: ['', Validators.required],
      videoSolucio: ['']
    });

    this.currentTab = 0;
    this.radioValue = 'equip';
  }

  nextPrev(n) {
    this.currentTab = this.currentTab + n;
    this.radioValue = 'equip';
  }


  onSubmit() {
    console.log(this.solucioForm.value)
  }

  onItemChange(value) {
    this.radioValue = value;
  }
}
