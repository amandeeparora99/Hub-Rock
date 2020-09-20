import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';


@Component({
  selector: 'app-solucio',
  templateUrl: './solucio.component.html',
  styleUrls: ['./solucio.component.css']
})
export class SolucioComponent implements OnInit {

  constructor(private fb: FormBuilder, private httpClient: HttpCommunicationService) { }

  solucioForm: FormGroup;
  radioValue;
  currentTab: number; // Current tab is set to be the first tab (0)
  numberOfTabs = 1; //0 + 1 = 2 tabs
  success = false;

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;

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
      nomSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioBreuSolucio: ['', [Validators.required, Validators.maxLength(280), Validators.minLength(3)]],  //max 280 chars en aquest
      problemaSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioSolucio: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],  //textarea gran, 500 o 1000 va be?
      innovadoraSolucio: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      faseSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      videoSolucio: [''],
      nomEquip: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      membreArray: this.fb.array([
        this.addMemberFormGroup(),  //
        this.addMemberFormGroup(),
      ])
    });

    this.currentTab = 0;
    this.radioValue = 'equip';

    this.subscriptionForm$ = this.solucioForm.valueChanges.subscribe(value => {
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

  logValidationErrorsUntouched(group: FormGroup = this.solucioForm): void {
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
  removeMemberButtonClick(membreGroupIndex: number): void {
    (<FormArray>this.solucioForm.get('membreArray')).removeAt(membreGroupIndex)
  }

  addMemberButtonClick(): void {
    (<FormArray>this.solucioForm.get('membreArray')).push(this.addMemberFormGroup());
  }

  addMemberFormGroup(): FormGroup {
    return this.fb.group({
      nomICognomsMembre: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      posicioMembre: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      linkMembre: ['']
    })
  }

  nextPrev(n) {
    this.currentTab = this.currentTab + n;
    this.radioValue = 'equip';
  }


  onSubmit() {

    if (!this.solucioForm.valid) {
      this.logValidationErrorsUntouched()
    }


    console.log(this.solucioForm.value)
  }

  onItemChange(value) {
    this.radioValue = value;
    // if (this.radioValue == 'individual') {

    //   for (var i = 0; i < (<FormArray>this.solucioForm.get('membreArray')).controls.length; i++) {
    //     console.log(i)

    //     this.removeMemberButtonClick(i);
    //   }

    //   this.solucioForm.get('nomEquip').clearValidators();
    //   console.log((<FormArray>this.solucioForm.get('membreArray')).controls.length)

    // } else if (this.radioValue == 'equip') {
    //   this.solucioForm.get('nomEquip').setValidators(Validators.required);
    //   this.addMemberButtonClick();
    //   this.addMemberButtonClick();
    // }
    // console.log(this.radioValue)
  }

  desaBorrador() {

    const formData = new FormData();
    formData.append('descripcio_short', this.solucioForm.get('descripcioBreuSolucio').value);
    formData.append('descripcio_long', this.solucioForm.get('descripcioSolucio').value);
    formData.append('individual_equip', this.solucioForm.get('0').value);
    // formData.append('limit_participants', this.solucioForm.get('descripcioBreuSolucio').value);
    formData.append('problema', this.solucioForm.get('problemaSolucio').value);
    formData.append('perque_innovacio', this.solucioForm.get('innovadoraSolucio').value);
    formData.append('fase_desenvolupament', this.solucioForm.get('faseSolucio').value);
    formData.append('url_video', this.solucioForm.get('videoSolucio').value);
    formData.append('nom', this.solucioForm.get('nomSolucio').value);

    //FALTA TOT LO DE ITERAR SOBRE MEMBRES I TAL


    this.subscriptionHttp1$ = this.httpClient.addSolucioBorrador(formData, 2)
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

  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()
    this.subscriptionHttp1$?.unsubscribe()

  }

}

