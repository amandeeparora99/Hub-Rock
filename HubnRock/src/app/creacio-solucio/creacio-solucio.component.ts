import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, RequiredValidator, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HasUnsavedData } from '../has-unsaved-data';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { User } from '../user';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-creaciosolucio',
  templateUrl: './creacio-solucio.component.html',
  styleUrls: ['./creacio-solucio.component.css']
})
export class CreacioSolucioComponent implements OnInit, HasUnsavedData {

  constructor(public toastr: ToastrService, private fb: FormBuilder, private httpClient: HttpCommunicationService, private aRouter: ActivatedRoute, private router: Router) { }

  hasUnsavedData(): boolean {
    if (this.formDone) {
      return false;
    } else {
      return this.solucioForm.dirty;
    }
  }

  currentUser: User;

  checkUntouched = false;

  idSolucioCreada;
  idSolucioEsborrany;

  private idRepte;
  repte;

  pdfArray = [];
  totalRecursosSize = 0;

  solucioForm: FormGroup;
  radioValue;
  currentTab: number; // Current tab is set to be the first tab (0)
  numberOfTabs = 1; //0 + 1 = 2 tabs
  success = false;
  borradorEnviat = false;
  maxMembres = 10;
  loading = false;

  formDone = false;

  dateIniciRepte;
  dateFinalRepte;
  currentDate;
  mailTo;

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;
  subscriptionHttp3$: Subscription;

  termesChecked = false;
  politicaChecked = false;


  validationMessages = {
    'nomSolucio': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 255 caràcters'

    },
    'descripcioBreuSolucio': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 280 caràcters.'

    },
    'problemaSolucio': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 255 caràcters'

    },
    'descripcioSolucio': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 1000 caràcters.'

    },
    'innovadoraSolucio': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 1000 caràcters'

    },
    'faseSolucio': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 255 caràcters.'

    },
    'videoSolucio': {
      'pattern': 'No és un enllaç de Youtube vàlid'
    },
    'nomEquip': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 255 caràcters'

    },
    'nomICognomsMembre': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 255 caràcters'

    },
    'posicioMembre': {
      'required': 'És un camp obligatori.',
      'minlength': 'Ha de tenir mínim de 3 caràcters.',
      'maxlength': 'Has sobrepassat el màxim de 255 caràcters'

    },
    'campsErronis': {
      'errors': 'Hi ha camps erronis, comprova que el formulari estigui omplert correctament',
    },
    'repteChecks': {
      'noValid': 'No es pot participar al repte, el repte no és vàlid',
      'noEnProces': 'No es pot participar al repte, el repte no està en procés'
    },
    'repteIndividualOEquip': {
      'repteEnEquip': 'El repte només accepta solucions en equip',
      'repteIndividual': 'El repte només accepta solucions individuals',
      'repteEnEquipLimitMembres': 'L\'equip supera el limit de membres indicat pel repte'

    }
  };


  formErrors = {
    'nomSolucio': '',
    'campsErronis': '',
    'repteChecks': '',
    'repteIndividualOEquip': '',
  };


  ngOnInit(): void {

    this.httpClient.currentUser.subscribe(
      data => {
        this.currentUser = data;
      }
    );

    this.idRepte = this.aRouter.snapshot.params.id;

    this.httpClient.getRepte(this.idRepte)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            this.mailTo = data.row.user.email;
            this.repte = data.row;
            this.dateIniciRepte = new Date(this.repte.data_inici);
            this.dateFinalRepte = new Date(this.repte.data_final);
            this.currentDate = new Date();
          }
        });

    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

    this.solucioForm = this.fb.group({
      nomSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioBreuSolucio: ['', [Validators.required, Validators.maxLength(280), Validators.minLength(3)]],  //max 280 chars en aquest
      problemaSolucio: ['', [Validators.required, Validators.maxLength(5000), Validators.minLength(3)]],
      descripcioSolucio: ['', [Validators.required, Validators.maxLength(5000), Validators.minLength(3)]],  //textarea gran, 500 o 1000 va be?
      innovadoraSolucio: ['', [Validators.required, Validators.maxLength(5000), Validators.minLength(3)]],
      faseSolucio: ['', [Validators.required, Validators.maxLength(5000), Validators.minLength(3)]],
      videoSolucio: ['', [Validators.pattern(regExp)]],
      pdf: [''],
      nomEquip: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      membreArray: this.fb.array([
        this.addMemberFormGroup(),  //
        this.addMemberFormGroup(),
      ])
    });

    this.currentTab = 0;
    this.radioValue = 'equip';

    // this.subscriptionForm$ = this.solucioForm.valueChanges.subscribe(value => {
    //   this.logValidationErrors(this.solucioForm)
    // });
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
        this.logValidationErrorsUntouched(abstractControl);
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

  changeCurrentTab(tabNumber) {
    this.currentTab = tabNumber;
  }

  removeMemberButtonClick(membreGroupIndex: number): void {
    let confirmWindow = confirm('Estàs segur que vols eliminar aquest membre?')
    if (confirmWindow == true) {
      (<FormArray>this.solucioForm.get('membreArray')).removeAt(membreGroupIndex)
    }
  }

  addMemberButtonClick(): void {
    if ((<FormArray>this.solucioForm.get('membreArray')).length < this.maxMembres) {
      (<FormArray>this.solucioForm.get('membreArray')).push(this.addMemberFormGroup());
    }
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
  }




  onItemChange(value) {
    this.radioValue = value;
    if (this.radioValue == 'individual') {
      for (let control of (<FormArray>this.solucioForm.get('membreArray')).controls) {

        this.solucioForm.get('nomEquip').clearValidators()
        this.solucioForm.get('nomEquip').updateValueAndValidity()

        this.solucioForm.updateValueAndValidity()

        if (control instanceof FormGroup) {

          control.controls.nomICognomsMembre.clearValidators()
          control.controls.nomICognomsMembre.updateValueAndValidity()


          control.controls.posicioMembre.clearValidators()
          control.controls.posicioMembre.updateValueAndValidity()


          control.controls.linkMembre.clearValidators()
          control.controls.linkMembre.updateValueAndValidity()

          control.updateValueAndValidity()
        }
      }
    } else if (this.radioValue == 'equip') {

      this.solucioForm.get('nomEquip').setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
      this.solucioForm.get('nomEquip').updateValueAndValidity()

      this.solucioForm.updateValueAndValidity()


      for (let control of (<FormArray>this.solucioForm.get('membreArray')).controls) {
        if (control instanceof FormGroup) {

          control.controls.nomICognomsMembre.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
          control.controls.nomICognomsMembre.updateValueAndValidity()


          control.controls.posicioMembre.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
          control.controls.posicioMembre.updateValueAndValidity()


          control.controls.linkMembre.updateValueAndValidity()

          control.updateValueAndValidity();
        }
      }

    }
  }

  onPdfSelected(event) {
    const maxRecursosSize = 10485760;
    let duplicateFile = false;
    if (event.target.files) {
      for (let index = 0; index < event.target.files.length; index++) {
        duplicateFile = false;
        this.pdfArray.forEach(element => {
          if (element.name == event.target.files[index].name && element.size == event.target.files[index].size) {
            duplicateFile = true;
          }
        });

        if (!duplicateFile) {
          if (this.totalRecursosSize + event.target.files[index].size < maxRecursosSize) {
            this.pdfArray.push(event.target.files[index])
            this.totalRecursosSize += event.target.files[index].size
          }
          else {
            alert('Els recursos no poden superar el límit de 10MB')
          }
        }
      } // let pdfCleared=f alse; // for (let index=0 ; index < event.target.files.length; index++) { // const element=e vent.target.files[index]; // if (element.size < 1000000) { // if (!pdfCleared) { // this.pdfArray=[] // pdfCleared=t rue; // } // this.pdfArray.push(element); // this.pdfChanged=t rue; // } else { // alert( 'L\'arxiu supera el límit de 1MB ')
      //   }
      // }
    }
  }

  deletePdf(index) {
    let confirmWindow = confirm('Estàs segur que vol eliminar aquest pdf?')

    if (confirmWindow == true) {
      this.totalRecursosSize = this.totalRecursosSize - this.pdfArray[index].size;
      this.pdfArray.splice(index, 1)
    }

  }

  appendInfo() {
    var email = { 
      subject: 'Nova proposta de solució pel teu repte',
      reciever: this.mailTo,
      missatge: 'Tens una nova proposta pel teu repte "'+this.repte.nom+'". \nPots accedir a les propostes del teu repte utilitzant el següent enllaç: https://hubandrock.com/repte/'+this.repte.idrepte
    };
    return email;
  }

  sendRegisteredMail() {
    console.log("ENVIANT MAIL...")
    let emailForm = this.appendInfo();
    console.log(emailForm)
    this.subscriptionHttp3$ = this.httpClient.sendRegisteredMail(emailForm)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data)
            if (data.data == "success") {
              console.log("Email sent for admin")
            }
            else{
              console.log("Email NOT sent for admin")
            }
          });
  }

  onSubmit() {
    this.checkUntouched = true;
    this.formErrors.repteIndividualOEquip = '';
    if (!this.solucioForm.valid) {
      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

      this.logValidationErrorsUntouched()

    } else if (this.repte.estat_idestat != 3) {

      if (!this.formErrors.repteChecks) {
        this.formErrors.repteChecks += this.validationMessages.repteChecks.noValid + ' ';
      }

    } else if (this.dateIniciRepte > this.currentDate || this.dateFinalRepte < this.currentDate) {

      if (!this.formErrors.repteChecks) {
        this.formErrors.repteChecks += this.validationMessages.repteChecks.noEnProces + ' ';
      }

    } else if (this.repte.individual_equip == 0 && this.radioValue != 'individual') {

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

      if (!this.formErrors.repteIndividualOEquip) {
        this.formErrors.repteIndividualOEquip += this.validationMessages.repteIndividualOEquip.repteIndividual + ' ';
      }

    } else if (this.repte.individual_equip == 1 && this.radioValue != 'equip') {

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

      if (!this.formErrors.repteIndividualOEquip) {
        this.formErrors.repteIndividualOEquip += this.validationMessages.repteIndividualOEquip.repteEnEquip + ' ';
      }

    } else if (this.repte.limit_participants && (<FormArray>this.solucioForm.get('membreArray')).length > this.repte.limit_participants) {

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

      if (!this.formErrors.repteIndividualOEquip) {
        this.formErrors.repteIndividualOEquip += this.validationMessages.repteIndividualOEquip.repteEnEquipLimitMembres + ' ';
      }

    }
    else {
      let confirmWindow = confirm('Està segur que vol enviar aquesta solució?')

      if (confirmWindow == true) {
        this.formDone = true;

        if (this.formErrors.campsErronis) {
          this.formErrors.campsErronis = '';
        }

        let formData = this.appendRepte();

        this.subscriptionHttp1$ = this.httpClient.addSolucioValid(formData, this.idRepte)
          .pipe(first())
          .subscribe(
            data => {
              if (data.code == 1) {
                this.sendRegisteredMail();
                window.scrollTo(0, 0)

                this.idSolucioCreada = data.lastId;
                this.success = true;

                this.toastr.success('Solució enviada correctament!', 'Enviat')
              }

            });
      }


    }


  }

  desaBorrador() {
    if (!this.solucioForm.get('nomSolucio').value) {

      if (!this.formErrors.nomSolucio) {
        this.formErrors.nomSolucio += this.validationMessages.nomSolucio.required + ' ';
      }

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

    } else if (this.solucioForm.get('nomSolucio').value.length < 3) {

      if (!this.formErrors.nomSolucio) {
        this.formErrors.nomSolucio += this.validationMessages.nomSolucio.minlength + ' ';
      }

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

    } else if (this.solucioForm.get('nomSolucio').value.length > 255) {

      if (!this.formErrors.nomSolucio) {
        this.formErrors.nomSolucio += this.validationMessages.nomSolucio.maxlength + ' ';
      }

      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

    } else if (this.repte.estat_idestat != 3) {

      if (!this.formErrors.repteChecks) {
        this.formErrors.repteChecks += this.validationMessages.repteChecks.noValid + ' ';
      }

    } else if (this.dateIniciRepte > this.currentDate || this.dateFinalRepte < this.currentDate) {

      if (!this.formErrors.repteChecks) {
        this.formErrors.repteChecks += this.validationMessages.repteChecks.noEnProces + ' ';
      }

    } else {
      this.formDone = true;
      console.log("No te errors")

      if (this.formErrors.campsErronis) {
        this.formErrors.campsErronis = '';
      }

      let formData: any = this.appendRepte();

      // for (var value of formData.values()) {
      //   console.log(value);
      // }

      this.subscriptionHttp2$ = this.httpClient.addSolucioBorrador(formData, this.idRepte)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == '1') {
              window.scrollTo(0, 0)
              this.idSolucioEsborrany = data.lastId;
              this.success = true;
              this.borradorEnviat = true;

              this.toastr.success('Solució desada com a esborrany', 'Desat')
            }
          });
    }
  }

  appendRepte(): FormData {
    const formData = new FormData();

    if (this.solucioForm.get('descripcioBreuSolucio').value) {
      formData.append('descripcio_short', this.solucioForm.get('descripcioBreuSolucio').value);
    }

    if (this.solucioForm.get('descripcioSolucio').value) {
      formData.append('descripcio_long', this.solucioForm.get('descripcioSolucio').value);
    }


    // if (this.solucioForm.get('descripcioSolucio').value) {
    //   formData.append('limit_participants', '10');
    // }

    if (this.solucioForm.get('nomEquip').value) {
      formData.append('nom_equip', this.solucioForm.get('nomEquip').value);
    }

    if (this.solucioForm.get('problemaSolucio').value) {
      formData.append('problema', this.solucioForm.get('problemaSolucio').value);
    }

    if (this.solucioForm.get('innovadoraSolucio').value) {
      formData.append('perque_innovacio', this.solucioForm.get('innovadoraSolucio').value);
    }

    if (this.solucioForm.get('faseSolucio').value) {
      formData.append('fase_desenvolupament', this.solucioForm.get('faseSolucio').value);
    }

    if (this.solucioForm.get('videoSolucio').value) {
      formData.append('url_video', this.solucioForm.get('videoSolucio').value);
    }

    if (this.solucioForm.get('nomSolucio').value) {
      formData.append('nom', this.solucioForm.get('nomSolucio').value);
    }

    if (this.radioValue == "individual") {

      formData.append('individual_equip', '0');

    } else if (this.radioValue == "equip") {

      formData.append('individual_equip', '1')

      //APPENDING MEMBRES
      for (var i = 0; i < (<FormArray>this.solucioForm.get('membreArray')).controls.length; i++) {

        if (this.solucioForm.get('membreArray').value[i].nomICognomsMembre && this.radioValue == 'equip') {
          formData.append(`membre_nom[${i}]`, this.solucioForm.get('membreArray').value[i].nomICognomsMembre);
        } else {
          formData.append(`membre_nom[${i}]`, '');
        }

        if (this.solucioForm.get('membreArray').value[i].posicioMembre && this.radioValue == 'equip') {
          formData.append(`membre_posicio[${i}]`, this.solucioForm.get('membreArray').value[i].posicioMembre);
        }

        if (this.solucioForm.get('membreArray').value[i].linkMembre && this.radioValue == 'equip') {
          formData.append(`membre_link[${i}]`, this.solucioForm.get('membreArray').value[i].linkMembre);
        }
      }

    }

    if (this.pdfArray.length) {
      for (let index = 0; index < this.pdfArray.length; index++) {
        const file = this.pdfArray[index];

        formData.append(`recurs_solucio_nom[${index}]`, file.name);
        formData.append(`recurs_solucio_url_file[${index}]`, file);
      }
    }

    return formData;
  }

  changeChecked(normes) {
    if (normes == 'termesChecked') {
      this.termesChecked = !(this.termesChecked);
    }
    else if (normes == 'politicaChecked') {
      this.politicaChecked = !(this.politicaChecked);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {

    if (this.solucioForm.dirty && !this.formDone) {
      $event.returnValue = true;
    }
  }



  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()
    this.subscriptionHttp1$?.unsubscribe()
    this.subscriptionHttp2$?.unsubscribe()
  }

}

