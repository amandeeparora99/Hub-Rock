import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';

@Component({
  selector: 'app-contacte',
  templateUrl: './contacte.component.html',
  styleUrls: ['./contacte.component.css']
})
export class ContacteComponent implements OnInit {

  constructor(private fb: FormBuilder, public toastr: ToastrService, private httpCommunication: HttpCommunicationService) { }

  contacteForm: FormGroup;
  subscriptionHttp$: Subscription;

  validationMessages = {
    'nomICognom': {
      'required': 'És un camp obligatori',
      'minlength': 'Nom invàlid',
      'maxlength': 'Has sobrepassat el límit de caràcters'

    },
    'nomEmpresa': {
      'required': 'És un camp obligatori.',
      'minlength': 'Nom invàlid',
      'maxlength': 'Has sobrepassat el límit de caràcters'

    },
    'correuContacte': {
      'required': 'És un camp obligatori.',
      'email': 'Introdueix un correu vàlid'

    },
    'missatge': {
      'required': 'És un camp obligatori',
      'minlength': 'Missatge massa curt',
      'maxlength': 'Has sobrepassat el límit de caràcters'

    }
  };

  formErrors = {
    'nomICognom': '',
    'nomEmpresa': '',
    'correuContacte': '',
    'missatge': '',
  };


  ngOnInit(): void {

    this.contacteForm = this.fb.group({
      nomICognom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      nomEmpresa: ['', [Validators.maxLength(255)]],
      correuContacte: ['', [Validators.required, Validators.email]],
      missatge: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
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

  appendRepte() {
    var email = { 
      nom_cognoms: this.contacteForm.get('nomICognom').value, 
      nom_empresa: this.contacteForm.get('nomEmpresa').value,
      correu_electronic: this.contacteForm.get('correuContacte').value,
      missatge: this.contacteForm.get('missatge').value,
    };

    return email;
  }

  onSubmit(){
    let contactForm = this.appendRepte();

    if (!this.contacteForm.valid) {
      this.toastr.error('Revisa bé els camps abans d\'enviar el correu.', 'Incorrecte')
    }
    else{
      //Aqui fer el Node
      
      this.subscriptionHttp$ = this.httpCommunication.sendContactEmail(contactForm)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data)
            if (data.data == "success") {
              window.scrollTo(0, 0);
              this.contacteForm.reset();
              this.toastr.success('El teu correu ha estat enviat correctament', 'Missatge enviat')
            }
            else{
              this.toastr.error('Hi ha hagut un error, intenta-ho més tard', 'Error')
            }
          });
    }
  }
}
