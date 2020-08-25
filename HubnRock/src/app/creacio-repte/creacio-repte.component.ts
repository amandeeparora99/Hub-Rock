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
  radioValue;

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
      descripcioBreuRepte: ['', Validators.required]
    });
  }

  nextPrev(n) {
    // // This function will figure out which tab to display
    // var x = document.getElementsByClassName("tab");
    // // Exit the function if any field in the current tab is invalid:
    // if (n == 1 && !validateForm()) return false;
    // // Hide the current tab:
    // x[currentTab].style.display = "none";
    // // Increase or decrease the current tab by 1:
    // currentTab = currentTab + n;
    // // if you have reached the end of the form...
    // if (currentTab >= x.length) {
    //   // ... the form gets submitted:
    //   document.getElementById("regForm").submit();
    //   return false;
    // }
    // // Otherwise, display the correct tab:
    // showTab(currentTab);
  }

}
