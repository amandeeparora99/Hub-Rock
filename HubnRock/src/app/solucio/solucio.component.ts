import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';


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
    this.solucioForm = this.fb.group({
      nomSolucio: ['', Validators.required],
      descripcioBreuSolucio: ['', Validators.required],
      problemaSolucio: ['', Validators.required],
      descripcioSolucio: ['', Validators.required],
      innovadoraSolucio: ['', Validators.required],
      faseSolucio: ['', Validators.required],
      videoSolucio: [''],
      nomEquip: ['', Validators.required],
      membreArray: this.fb.array([
        this.addMemberFormGroup(),
        this.addMemberFormGroup(),
      ])
    });

    this.currentTab = 0;
    this.radioValue = 'equip';

    this.solucioForm.valueChanges.subscribe(value => {
      this.logValidationErrors(this.solucioForm)
    });
  }


  logValidationErrors(group: FormGroup = this.solucioForm): void {
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
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls) {
      //     if (control instanceof FormGroup) {
      //       this.logValidationErrors(control);
      //     }
      //   }
      // }
    })
  }

  removeMemberButtonClick(membreGroupIndex: number): void {
    (<FormArray>this.solucioForm.get('membreArray')).removeAt(membreGroupIndex)
  }

  addMemberButtonClick(): void {
    (<FormArray>this.solucioForm.get('membreArray')).push(this.addMemberFormGroup());
    console.log(this.solucioForm.value)
  }

  addMemberFormGroup(): FormGroup {
    return this.fb.group({
      nomICognomsMembre: ['', Validators.required],
      posicioMembre: ['', Validators.required],
      linkMembre: ['']
    })
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

    // const membreArray = this.solucioForm.get('membreArray');
    // if (this.radioValue == 'individual') {
    //   membreArray.clearValidators();
    // }

    // this.accountType = event.target.value;
    // const nifControl = this.registerForm.get('nomNifEmpresa');
    // if (event.target.value == "rockstar") {
    //   nifControl.clearValidators();
    // }
    // else {
    //   nifControl.setValidators(Validators.required);
    // }

    // (<FormArray>this.solucioForm.get('membreArray')).at(1).clearValidators()
    this.solucioForm.get('membreArray').clearValidators();
    this.solucioForm.get('membreArray').clearAsyncValidators();
    this.solucioForm.get('membreArray').updateValueAndValidity();
    console.log(this.solucioForm.get('membreArray'))
  }
}
