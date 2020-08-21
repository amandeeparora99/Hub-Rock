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
this.radioValue = 'equip';
    this.currentTab = 0;
    // this.showTab(this.currentTab); // Display the current tab

  }

  // showTab(n: number) {
  //   this.n = n;
  //   // This function will display the specified tab of the form...
  //   var x = document.getElementsByClassName("tab") as HTMLCollectionOf<HTMLElement>
  //   x[n].style.display = "block";
  //   //... and fix the Previous/Next buttons:
  //   // if (n == 0) {
  //   //   document.getElementById("prevBtn").style.display = "none";
  //   // } else {
  //   //   document.getElementById("prevBtn").style.display = "inline";
  //   // }
  //   if (n == (x.length - 1)) {
  //     document.getElementById("nextBtn").innerHTML = "Submit";
  //   } else {
  //     document.getElementById("nextBtn").innerHTML = "Next";
  //   }
  //   //... and run a function that will display the correct step indicator:
  //   // fixStepIndicator(n)
  // }

  nextPrev(n) {
    this.currentTab = this.currentTab + n;

  }

  fixStepIndicator(n) {
    // // This function removes the "active" class of all steps...
    // var i, x = document.getElementsByClassName("step");
    // for (i = 0; i < x.length; i++) {
    //   x[i].className = x[i].className.replace(" active", "");
    // }
    // //... and adds the "active" class on the current step:
    // x[n].className += " active";
  }

  onSubmit() {
    console.log(this.solucioForm.value)
  }

  onItemChange(value) {
    this.radioValue = value;
  }
}
