import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacte',
  templateUrl: './contacte.component.html',
  styleUrls: ['./contacte.component.css']
})
export class ContacteComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  contacteForm: FormGroup;

  validationMessages = {
    // 'nomSolucio': {
    //   'required': 'És un camp obligatori.',
    //   'minlength': 'Ha de tenir mínim de 3 caràcters.',
    //   'maxlength': 'Has sobrepassat el màxim de 255 caràcters'

    // }
  };


  formErrors = {
    'nomICognom': '',
    'nomEmpresa': '',
    'correuContacte': '',
    'missatge': '',
  };

  ngOnInit(): void {
    this.contacteForm = this.fb.group({
      nomICognom: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      nomEmpresa: ['', [Validators.maxLength(255)]],
      correuContacte: ['', [Validators.required, Validators.email]],
      missatge: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    })

    this.contacteForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.contacteForm)
    });
  }

  logValidationErrors(group: FormGroup = this.contacteForm): void {
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

  onSubmit(){
    
  }
}
