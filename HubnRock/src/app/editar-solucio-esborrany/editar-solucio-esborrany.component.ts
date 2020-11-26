import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { User } from '../user';

@Component({
  selector: 'app-editar-solucio-esborrany',
  templateUrl: './editar-solucio-esborrany.component.html',
  styleUrls: ['./editar-solucio-esborrany.component.css']
})
export class EditarSolucioEsborranyComponent implements OnInit {

  constructor(private fb: FormBuilder, private httpClient: HttpCommunicationService, private aRouter: ActivatedRoute, private router: Router) { }

  hasUnsavedData(): boolean {
    if (this.formDone) {
      return false;
    } else {
      return this.solucioForm.dirty;
    }
  }

  currentUser: User;

  idRepte;
  repte;

  checkUntouched = false;

  idSolucio;
  solucio;

  pdfArray = [];
  pdfChanged = false;

  solucioForm: FormGroup;
  radioValue;
  currentTab: number; // Current tab is set to be the first tab (0)
  numberOfTabs = 1; //0 + 1 = 2 tabs

  success = false;

  eliminat = false;
  enviat = false;
  actualitzat = false;

  maxMembres = 10;
  loading = false;

  formDone = false;

  dateIniciRepte;
  dateFinalRepte;
  currentDate;

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;

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

    this.currentTab = 0;
    this.radioValue = 'equip';

    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

    this.solucioForm = this.fb.group({
      nomSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioBreuSolucio: ['', [Validators.required, Validators.maxLength(280), Validators.minLength(3)]],  //max 280 chars en aquest
      problemaSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioSolucio: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],  //textarea gran, 500 o 1000 va be?
      innovadoraSolucio: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
      faseSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      videoSolucio: ['', [Validators.pattern(regExp)]],
      pdf: [''],
      nomEquip: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      membreArray: this.fb.array([

      ])
    });

    this.idSolucio = this.aRouter.snapshot.params.id;

    this.httpClient.getSolucio(this.idSolucio)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == 1) {

            this.solucio = data.row;
            this.idRepte = data.row.idrepte;

            this.dateIniciRepte = new Date(this.solucio.data_inici);
            this.dateFinalRepte = new Date(this.solucio.data_final);
            this.currentDate = new Date();

            this.httpClient.getRepte(this.idRepte).pipe(first())
              .subscribe(
                data => {
                  if (data.code == 1) {
                    this.repte = data.row;

                    this.solucioForm.patchValue({
                      nomSolucio: this.solucio.solucio_proposada_nom,
                      descripcioBreuSolucio: this.solucio.solucio_proposada_descripcio_short,
                      problemaSolucio: this.solucio.solucio_proposada_problema,
                      descripcioSolucio: this.solucio.solucio_proposada_descripcio_long,
                      innovadoraSolucio: this.solucio.solucio_proposada_perque_innovacio,
                      faseSolucio: this.solucio.solucio_proposada_fase_desenvolupament,
                      videoSolucio: this.solucio.solucio_proposada_video,
                      nomEquip: this.solucio.solucio_proposada_nom_equip,

                    })

                    if (this.solucio.recursos.length) {
                      this.pdfArray = this.solucio.recursos
                      console.log(this.pdfArray)
                    }

                    if (this.solucio.solucio_proposada_individual_equip == '0') {

                      this.radioValue = 'individual'

                    } else if (this.solucio.solucio_proposada_individual_equip == '1') {

                      this.radioValue = 'equip'

                    }

                    if (this.solucio.membres.length) {
                      for (var i = 0; i < this.solucio.membres.length; i++) {

                        if ((<FormArray>this.solucioForm.get('membreArray')).length < this.maxMembres) {
                          (<FormArray>this.solucioForm.get('membreArray')).push(this.addMemberFormGroup());
                        }

                        (<FormArray>this.solucioForm.get('membreArray')).at(i).patchValue({
                          nomICognomsMembre: this.solucio.membres[i].membre_nom,
                          posicioMembre: this.solucio.membres[i].membre_posicio,
                          linkMembre: this.solucio.membres[i].membre_link,
                        });
                      }

                    } else {
                      (<FormArray>this.solucioForm.get('membreArray')).push(this.addMemberFormGroup());
                      (<FormArray>this.solucioForm.get('membreArray')).push(this.addMemberFormGroup());

                    }

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
                }
              )

          }
        });



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
    if (event.target.files) {
      let pdfCleared = false;

      for (let index = 0; index < event.target.files.length; index++) {
        const element = event.target.files[index];

        if (element.size < 1000000) {
          if (!pdfCleared) {
            this.pdfArray = []
            pdfCleared = true;
          }

          this.pdfArray.push(element);
          this.pdfChanged = true;
        } else {
          alert('L\'arxiu supera el límit de 1MB')
        }
      }
    }
    console.log(this.pdfArray)
  }

  resetPdfArray() {
    this.pdfArray = [];
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

        // this.subscriptionHttp1$ = this.httpClient.addSolucioValid(formData, this.idRepte)
        //   .pipe(first())
        //   .subscribe(
        //     data => {
        //       if (data.code == 1) {
        //         this.idSolucioCreada = data.lastId;
        //         this.success = true;
        //         this.enviat = true;
        //         console.log(data);

        //         this.subscriptionHttp1$ = this.httpClient.deleteSolucio(this.idSolucio)
        //           .pipe(first())
        //           .subscribe();
        //       }


        //     });

        this.subscriptionHttp1$ = this.httpClient.editSolucio(this.idSolucio, formData)
          .pipe(first())
          .subscribe(
            data => {
              if (data.code == 1) {
                window.scrollTo(0, 0)

                this.success = true;
                this.enviat = true;
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

      if (this.formErrors.campsErronis) {
        this.formErrors.campsErronis = '';
      }

      let formData: any = this.appendRepte();
      console.log("imprimint append my firned")

      for (var value of formData.values()) {
        console.log(value);
      }

      this.subscriptionHttp2$ = this.httpClient.editSolucioEsborrany(this.idSolucio, formData)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == '1') {
              window.scrollTo(0, 0)

              // this.success = true;
              // this.actualitzat = true;
              // let currentUserId = JSON.parse(localStorage.getItem('currentUser')).idUser;
              // this.router.navigate([`/perfil/${currentUserId}`])

            }
          });
    }
  }

  deleteSolucio() {
    let confirmWindow = confirm('Està segur que vol eliminar aquesta solució?')

    if (confirmWindow == true) {
      this.subscriptionHttp1$ = this.httpClient.deleteSolucio(this.idSolucio)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == 1) {
              window.scrollTo(0, 0)

              this.success = true;
              this.eliminat = true;
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

        if (this.solucio.membres[i]) {
          formData.append(`idmembre[${i}]`, this.solucio.membres[i].idmembre);
        }

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
        if (this.pdfChanged) {

          const file = this.pdfArray[index];

          formData.append(`recurs_solucio_nom[${index}]`, file.name);
          formData.append(`recurs_solucio_url_file[${index}]`, file);
        }

      }
    }

    return formData;
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

