import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { User } from '../user';

@Component({
  selector: 'app-editar-repte',
  templateUrl: './editar-repte.component.html',
  styleUrls: ['./editar-repte.component.css']
})
export class EditarRepteComponent implements OnInit {


  constructor(private router: Router, private aRouter: ActivatedRoute, private fb: FormBuilder, private httpClient: HttpCommunicationService,
    public datepipe: DatePipe, public toastr: ToastrService) { }

  hasUnsavedData(): boolean {
    if (this.formDone) {
      return false;
    } else {
      return this.repteForm.dirty;
    }
  }

  currentUser: User;

  public fileStorageUrl = environment.api + '/image/';

  repteForm: FormGroup;
  radioValue = 'equip';
  radioToSValue = 'hubandrock';
  currentTab: number = 0; // Current tab is set to be the first tab (0)
  numberOfTabs = 3; //0 + 1 = 2 tabs

  fotosReptePreview: any = {};
  fotosRepte: any = {};

  objectFotosPreview: any = {};
  objectFotos: any = {};

  objectSolucionsPreview: any = {};
  objectSolucions: any = {};

  objectPartnersPreview: any = {};
  objectPartners: any = {};

  objectJuratsPreview: any = {};
  objectJurats: any = {};

  repte;
  idRepte;

  success = false;

  eliminat = false;
  enviat = false;

  formDone = false;

  checkUntouched = false;

  pdfArray = [];
  totalRecursosSize = 0;

  subscriptionForm$: Subscription;
  subscriptionHttp1$: Subscription;

  @ViewChild('inputFile') myInputVariable: ElementRef;


  validationMessages = {
    'nomRepte': {
      'required': 'És un camp requerit',
      'maxlength': 'Nom massa llarg',
      'minlength': 'Nom massa curt'
    },
    'descripcioBreuRepte': {
      'required': 'És un camp requerit',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'descripcioDetalladaRepte': {
      'required': 'És un camp requerit',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'fotoPortada': {
      'required': 'És un camp requerit',
    },
    'videoSolucio': {
      'pattern': 'No és un enllaç de Youtube vàlid',

    },
    'checkboxGroup': {
      'requireCheckboxesToBeChecked': 'Selecciona almenys una categoria!'
    },
    'datesGroup': {
      'dataIniciBiggerThanFinal': 'El repte no pot acabar abans de començar!'
    },
    'limitParticipants': {
      'pattern': 'Entra un nombre de participants vàlid',
    },
    'dataInici': {
      'required': 'És un camp requerit',
      'dateShorterThanToday': 'La data no pot ser inferior a avui'
    },
    'dataFinalitzacio': {
      'required': 'És un camp requerit',
      'dateShorterThanToday': 'La data no pot ser inferior a avui'
    },
    'nomPremi': {
      'required': 'És un camp requerit',
      'maxlength': 'Nom massa llarg',
      'minlength': 'Nom massa curt'
    },
    'dotacioPremi': {
      'required': 'És un camp requerit',
      'minlength': 'Premi invàlid'
    },
    'descripcioPremi': {
      'required': 'És un camp requerit',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'fotoPremi': {

    },
    'nomSolucio': {
      'required': 'És un camp requerit',
      'maxlength': 'Nom massa llarg',
      'minlength': 'Nom massa curt'
    },
    'descripcioSolucio': {
      'required': 'És un camp requerit',
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'fotoSolucio': {
      'required': 'És un camp requerit',
    },
    'nomPartner': {
      'maxlength': 'Nom massa llarg',  //Falta fer que sigui required if tal.
      'minlength': 'Nom massa curt'
    },
    'breuDescripcioPartner': {
      'maxlength': 'Descripció massa llarga',
      'minlength': 'Descripció massa curta'
    },
    'logoPartner': {

    },
    'nomCognomsJurat': {
      'maxlength': 'Nom massa llarg',  //Falta fer que sigui required if tal.
      'minlength': 'Nom massa curt'
    },
    'biografiaJurat': {
      'maxlength': 'Biografia massa llarga',
      'minlength': 'Biografia massa curta'
    },
    'fotoJurat': {

    },
    'pregunta': {
      'required': 'És un camp requerit',
      'maxlength': 'Pregunta massa llarga',
      'minlength': 'Pregunta invàlida'
    },
    'resposta': {
      'required': 'És un camp requerit.',
      'maxlength': 'Resposta massa llarga',
      'minlength': 'Resposta invàlida'
    },
    'customTOS': {  //Sha de fer required si ha triat customTOS
      'required': 'És un camp requerit',
      'maxlength': 'Les bases legals excedeixen el màxim de caràcters',
      'minlength': 'Bases legals invàlides'
    },

    'campsErronis': {
      'errors': 'Hi ha camps erronis, comprova que el formulari estigui omplert correctament'
    }

  };


  formErrors = {
    'nomRepte': '',
    'descripcioBreuRepte': '',
    'descripcioDetalladaRepte': '',
    'fotoPortada': '',
    'videoSolucio': '',
    'checkboxGroup': '',
    'limitParticipants': '',
    'datesGroup': '',
    'dataInici': '',
    'dataFinalitzacio': '',
    'nomPremi': '',
    'dotacioPremi': '',
    'descripcioPremi': '',
    'fotoPremi': '',
    'nomSolucio': '',
    'descripcioSolucio': '',
    'fotoSolucio': '',
    'nomPartner': '',
    'breuDescripcioPartner': '',
    'logoPartner': '',
    'nomCognomsJurat': '',
    'biografiaJurat': '',
    'fotoJurat': '',
    'pregunta': '',
    'resposta': '',
    'customTOS': '',
    'campsErronis': '',
  };

  ngOnInit(): void {
    this.idRepte = this.aRouter.snapshot.params.id;

    this.httpClient.currentUser.subscribe(
      data => {
        this.currentUser = data;
      }
    );

    if (this.idRepte) {

      this.httpClient.getRepte(this.idRepte)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == '1') {

              this.repte = data.row;

              let participantsEmpresa = false;
              let participantsStartups = false;
              let participantsEstudiants = false;
              let participantsExperts = false;

              // PATCH PARTICIPANTS
              for (let index = 0; index < this.repte.participants.length; index++) {
                const participant = this.repte.participants[index];

                if (participant.participants_name == "Empreses") {
                  // this.repteForm.get('checkboxGroup').patchValue({
                  //   empresesCheckbox: [true]
                  // })
                  participantsEmpresa = true;
                } else if (participant.participants_name == "Startups") {
                  // this.repteForm.get('checkboxGroup').patchValue({
                  //   startupsCheckbox: [true]
                  // })
                  participantsStartups = true;
                } else if (participant.participants_name == "Estudiants") {
                  // this.repteForm.get('checkboxGroup').patchValue({
                  //   estudiantsCheckbox: [true]
                  // })
                  participantsEstudiants = true;
                } else if (participant.participants_name == "Experts") {
                  // this.repteForm.get('checkboxGroup').patchValue({
                  //   expertsCheckbox: [true]
                  // })
                  participantsExperts = true;
                }
              }

              var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

              this.repteForm = this.fb.group({
                nomRepte: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
                descripcioBreuRepte: ['', [Validators.required, Validators.maxLength(280), Validators.minLength(3)]],
                descripcioDetalladaRepte: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(3)]],
                fotoPortada: ['',
                  [Validators.required]
                ],
                fotoRepresentativa1: ['', []],
                fotoRepresentativa2: ['', []],
                fotoRepresentativa3: ['', []],
                pdf: [''],
                videoSolucio: ['', [Validators.pattern(regExp)]], //validador custom youtube format
                checkboxGroup: this.fb.group({
                  empresesCheckbox: [participantsEmpresa],
                  startupsCheckbox: [participantsStartups],
                  estudiantsCheckbox: [participantsEstudiants],
                  expertsCheckbox: [participantsExperts]
                }, { validator: requireCheckboxesToBeCheckedValidator() }),
                limitParticipants: ['', Validators.pattern('[0-9]+')],
                datesGroup: this.fb.group({
                  dataInici: ['', [Validators.required, dateShorterThanToday]],  //Data inici no pot ser anterior a la data actual
                  dataFinalitzacio: ['', [Validators.required, dateShorterThanToday]],
                }, { validator: dataIniciBiggerThanFinal() }),
                premiArray: this.fb.array([

                ]),
                solucioArray: this.fb.array([

                ]),
                partnerArray: this.fb.array([

                ]),
                juratArray: this.fb.array([

                ]),
                preguntaArray: this.fb.array([

                ]),

                customTOS: ['', [Validators.maxLength(5000), Validators.minLength(3)]],
              });

              this.subscriptionForm$ = this.repteForm.valueChanges.subscribe((data) => {
                this.logValidationErrors(this.repteForm)
              });

              this.repteForm.patchValue({
                nomRepte: this.repte.nom,
                descripcioBreuRepte: this.repte.descripcio_short,
                descripcioDetalladaRepte: this.repte.descripcio_long,
                videoSolucio: this.repte.url_video,

              })


              //PATCH INDIVIDUAL EQUIP
              if (this.repte.individual_equip == 1) {
                this.radioValue = 'equip'
              } else if (this.repte.individual_equip == 0) {
                this.radioValue = 'individual'
              }

              if (this.repte.limit_participants) {
                this.repteForm.patchValue({ limitParticipants: this.repte.limit_participants })
              }

              //PATCH DATES
              if (this.repte.data_inici) {
                let dateRepteInici = this.datepipe.transform(this.repte.data_inici, 'yyyy-MM-dd')
                this.repteForm.get('datesGroup').patchValue({ dataInici: dateRepteInici })
              }

              if (this.repte.data_final) {
                let dateRepteFinal = this.datepipe.transform(this.repte.data_final, 'yyyy-MM-dd')
                this.repteForm.get('datesGroup').patchValue({ dataFinalitzacio: dateRepteFinal })
              }

              //PATCH RECURSOS 
              if (this.repte.recursos.length) {
                this.repte.recursos.forEach(recurs => {
                  console.log('REEEEEEEEEEEEEECUUUUUUUUUUUUUUUUUUUUUUURS', recurs);
                  fetch(this.fileStorageUrl + recurs.recurs_url_fitxer, {
                    headers: { 'Content-Type': 'application/pdf' }
                  })
                    .then(response => response.blob()).then(blob => {
                      let file = new File([blob], recurs.recurs_nom);
                      this.pdfArray.push(file);
                      this.totalRecursosSize += file.size;
                    });
                  console.log('this.array my friend', this.pdfArray)
                });
              }

              //PATCH PREMIS
              if (this.repte.premis.length) {
                console.log('length premis', this.repte.premis.length)
                for (var i = 0; i < this.repte.premis.length; i++) {

                  (<FormArray>this.repteForm.get('premiArray')).push(this.addPremiFormGroup());

                  (<FormArray>this.repteForm.get('premiArray')).at(i).patchValue({
                    nomPremi: this.repte.premis[i].premi_nom,
                    dotacioPremi: this.repte.premis[i].premi_dotacio,
                    descripcioPremi: this.repte.premis[i].premi_descripcio
                  });

                  const fotoPremiName = 'fotoPremi' + i

                  this.addPremiToObject(fotoPremiName)

                  if (this.repte.premis[i].premi_url_photo) {
                    fetch(this.fileStorageUrl + this.repte.premis[i].premi_url_photo)
                      .then(res => res.blob()) // Gets the response and returns it as a blob
                      .then(blob => {
                        let blobToFile = new File([blob], 'image')
                        this.objectFotos[fotoPremiName] = blobToFile;

                        var reader = new FileReader();
                        reader.readAsDataURL(blob)
                        reader.onload = (event: any) => {
                          this.objectFotosPreview[fotoPremiName] = reader.result
                        }
                      })
                  }
                }

              } else {
                (<FormArray>this.repteForm.get('premiArray')).push(this.addPremiFormGroup());

              }

              //PATCH SOLUCIONS
              if (this.repte.solucions.length) {
                console.log('length solucions', this.repte.solucions.length)

                for (var i = 0; i < this.repte.solucions.length; i++) {

                  (<FormArray>this.repteForm.get('solucioArray')).push(this.addSolucioFormGroup());

                  (<FormArray>this.repteForm.get('solucioArray')).at(i).patchValue({
                    nomSolucio: this.repte.solucions[i].solucio_nom,
                    descripcioSolucio: this.repte.solucions[i].solucio_descripcio,
                  });

                  const fotoSolucioName = 'fotoSolucio' + i

                  this.addPremiToObject(fotoSolucioName)

                  if (this.repte.solucions[i].solucio_url_photo) {
                    fetch(this.fileStorageUrl + this.repte.solucions[i].solucio_url_photo)
                      .then(res => res.blob()) // Gets the response and returns it as a blob
                      .then(blob => {
                        let blobToFile = new File([blob], 'image')
                        this.objectSolucions[fotoSolucioName] = blobToFile;

                        var reader = new FileReader();
                        reader.readAsDataURL(blob)
                        reader.onload = (event: any) => {
                          this.objectSolucionsPreview[fotoSolucioName] = reader.result
                        }
                      })
                  }
                }


              } else {
                (<FormArray>this.repteForm.get('solucioArray')).push(this.addSolucioFormGroup());

              }

              //PATCH PARTNERS
              if (this.repte.partners.length) {
                for (var i = 0; i < this.repte.partners.length; i++) {

                  (<FormArray>this.repteForm.get('partnerArray')).push(this.addPartnerFormGroup());

                  (<FormArray>this.repteForm.get('partnerArray')).at(i).patchValue({
                    nomPartner: this.repte.partners[i].partner_nom,
                    breuDescripcioPartner: this.repte.partners[i].partner_descripcio,
                  });

                  const fotoPartnerName = 'fotoPartner' + i

                  this.addPremiToObject(fotoPartnerName)

                  if (this.repte.partners[i].partner_url_logo) {

                    // (<FormGroup>(<FormGroup>this.repteForm.controls.partnerArray).controls[i]).controls.logoPartner.clearValidators();
                    // (<FormGroup>(<FormGroup>this.repteForm.controls.partnerArray).controls[i]).controls.logoPartner.updateValueAndValidity({ emitEvent: false });

                    fetch(this.fileStorageUrl + this.repte.partners[i].partner_url_logo)
                      .then(res => res.blob()) // Gets the response and returns it as a blob
                      .then(blob => {
                        let blobToFile = new File([blob], 'image')
                        this.objectPartners[fotoPartnerName] = blobToFile;

                        var reader = new FileReader();
                        reader.readAsDataURL(blob)
                        reader.onload = (event: any) => {
                          this.objectPartnersPreview[fotoPartnerName] = reader.result
                        }
                        this.logValidationErrors()

                      })
                  }
                }

              } else {
                (<FormArray>this.repteForm.get('partnerArray')).push(this.addPartnerFormGroup());

              }

              //PATCH JURATS
              if (this.repte.jurats.length) {
                for (var i = 0; i < this.repte.jurats.length; i++) {

                  (<FormArray>this.repteForm.get('juratArray')).push(this.addJuratFormGroup());

                  (<FormArray>this.repteForm.get('juratArray')).at(i).patchValue({
                    nomCognomsJurat: this.repte.jurats[i].jurat_nom,
                    biografiaJurat: this.repte.jurats[i].jurat_bio,
                  });

                  const fotoJuratName = 'fotoJurat' + i

                  this.addPremiToObject(fotoJuratName)

                  if (this.repte.jurats[i].jurat_url_photo) {

                    // (<FormGroup>(<FormGroup>this.repteForm.controls.juratArray).controls[i]).controls.fotoJurat.clearValidators();
                    // (<FormGroup>(<FormGroup>this.repteForm.controls.juratArray).controls[i]).controls.fotoJurat.updateValueAndValidity({ emitEvent: false });

                    fetch(this.fileStorageUrl + this.repte.jurats[i].jurat_url_photo)
                      .then(res => res.blob()) // Gets the response and returns it as a blob
                      .then(blob => {
                        let blobToFile = new File([blob], 'image')
                        this.objectJurats[fotoJuratName] = blobToFile;

                        var reader = new FileReader();
                        reader.readAsDataURL(blob)
                        reader.onload = (event: any) => {
                          this.objectJuratsPreview[fotoJuratName] = reader.result
                        }
                        this.logValidationErrors()

                      })
                  }
                }

              } else {
                (<FormArray>this.repteForm.get('juratArray')).push(this.addJuratFormGroup());

              }

              //PATCH FAQ
              if (this.repte.faqs.length) {
                for (var i = 0; i < this.repte.faqs.length; i++) {

                  (<FormArray>this.repteForm.get('preguntaArray')).push(this.addPreguntaFormGroup());

                  (<FormArray>this.repteForm.get('preguntaArray')).at(i).patchValue({
                    pregunta: this.repte.faqs[i].faq_pregunta,
                    resposta: this.repte.faqs[i].faq_resposta,
                  });
                }

              } else {
                (<FormArray>this.repteForm.get('preguntaArray')).push(this.addPreguntaFormGroup());

              }
            }

            //PATCH CUSTOM TOS
            if (this.repte.bases_legals == 1) {
              this.radioToSValue = 'custom'
            } else if (this.repte.individual_equip == 0) {
              this.radioToSValue = 'hubandrock'
            }

            if (this.repte.bases_legals == 1) {
              this.repteForm.patchValue({ customTOS: this.repte.bases_legals_personals })
            }

            if (this.radioToSValue == 'hubandrock') {

              this.repteForm.get('customTOS').setValidators([Validators.maxLength(5000), Validators.minLength(3)])
              this.repteForm.get('customTOS').updateValueAndValidity()

            } else if (this.radioToSValue == 'custom') {

              this.repteForm.get('customTOS').setValidators([Validators.required, Validators.maxLength(5000), Validators.minLength(3)])
              this.repteForm.get('customTOS').updateValueAndValidity()

            }

            //PATCH FOTOS REPTE
            if (this.repte.url_photo_main) {
              fetch(this.fileStorageUrl + this.repte.url_photo_main)
                .then(res => res.blob()) // Gets the response and returns it as a blob
                .then(blob => {
                  let blobToFile = new File([blob], 'image')
                  this.fotosRepte.fotoPortada = blobToFile

                  var reader = new FileReader();
                  reader.readAsDataURL(blob)
                  reader.onload = (event: any) => {
                    this.fotosReptePreview.fotoPortada = reader.result
                  }
                  this.logValidationErrors()
                })
            }

            if (this.repte.url_photo_1) {
              fetch(this.fileStorageUrl + this.repte.url_photo_1)
                .then(res => res.blob()) // Gets the response and returns it as a blob
                .then(blob => {
                  let blobToFile = new File([blob], 'image')
                  this.fotosRepte.fotoRepresentativa1 = blobToFile

                  var reader = new FileReader();
                  reader.readAsDataURL(blob)
                  reader.onload = (event: any) => {
                    this.fotosReptePreview.fotoRepresentativa1 = reader.result
                  }
                  this.logValidationErrors()

                })
            }

            if (this.repte.url_photo_2) {
              fetch(this.fileStorageUrl + this.repte.url_photo_2)
                .then(res => res.blob()) // Gets the response and returns it as a blob
                .then(blob => {
                  let blobToFile = new File([blob], 'image')
                  this.fotosRepte.fotoRepresentativa2 = blobToFile

                  var reader = new FileReader();
                  reader.readAsDataURL(blob)
                  reader.onload = (event: any) => {
                    this.fotosReptePreview.fotoRepresentativa2 = reader.result
                  }
                  this.logValidationErrors()

                })
            }

            if (this.repte.url_photo_3) {
              fetch(this.fileStorageUrl + this.repte.url_photo_3)
                .then(res => res.blob()) // Gets the response and returns it as a blob
                .then(blob => {
                  let blobToFile = new File([blob], 'image')
                  this.fotosRepte.fotoRepresentativa3 = blobToFile

                  var reader = new FileReader();
                  reader.readAsDataURL(blob)
                  reader.onload = (event: any) => {
                    this.fotosReptePreview.fotoRepresentativa3 = reader.result
                  }
                  this.logValidationErrors()

                })
            }

          });

    }
  }


  getInterpolationCondition(name, i) {
    let stringInterpolation: string = name + i
    if (name == 'fotoPremi') {
      if (this.objectFotosPreview[stringInterpolation]) {
        return true;
      } else {
        return false;
      }
    }
    else if (name == 'fotoSolucio') {
      if (this.objectSolucionsPreview[stringInterpolation]) {
        return true;
      } else {
        return false;
      }
    }
    else if (name == 'fotoPartner') {
      if (this.objectPartnersPreview[stringInterpolation]) {
        return true;
      } else {
        return false;
      }
    }
    else if (name == 'fotoJurat') {
      if (this.objectJuratsPreview[stringInterpolation]) {
        return true;
      } else {
        return false;
      }
    }

  }

  getObjectProperty(name, i) {
    let stringInterpolation: string = name + i
    if (name == 'fotoPremi') {
      return this.objectFotosPreview[stringInterpolation];
    }
    else if (name == 'fotoSolucio') {
      return this.objectSolucionsPreview[stringInterpolation];
    }
    else if (name == 'fotoPartner') {
      return this.objectPartnersPreview[stringInterpolation];
    }
    else if (name == 'fotoJurat') {
      return this.objectJuratsPreview[stringInterpolation];
    }

  }


  logValidationErrors(group: FormGroup = this.repteForm): void {
    console.log('LOG VALIDATION CRIDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT')
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      console.log('hi puto hi ha foto portada o no?', this.fotosRepte.fotoPortada)

      if (!this.fotosRepte.fotoPortada) {
        this.repteForm.get('fotoPortada').setValidators([Validators.required])
        this.repteForm.get('fotoPortada').updateValueAndValidity({ emitEvent: false })
      } else {
        this.repteForm.get('fotoPortada').clearValidators()
        this.repteForm.get('fotoPortada').updateValueAndValidity({ emitEvent: false })
      }

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

      if (abstractControl instanceof FormArray) {

        if (abstractControl == this.repteForm.get('partnerArray')) {

          let partnerArrayCounter = 0;

          for (let control of (<FormArray>this.repteForm.get('partnerArray')).controls) {
            if (control instanceof FormGroup) {
              console.log('LOGO JURAT VALUE', this.objectPartners)
              console.log('AKFJÑLASJDFÑLKAJSDFÑASJFÑALDSJFÑLAJSD JODER', this.objectPartners['fotoPartner' + partnerArrayCounter])

              if (control.controls.nomPartner.value ||
                control.controls.breuDescripcioPartner.value ||
                this.objectPartners['fotoPartner' + partnerArrayCounter]) {
                control.controls.nomPartner.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomPartner.updateValueAndValidity({ emitEvent: false })


                control.controls.breuDescripcioPartner.setValidators([Validators.required, Validators.maxLength(900), Validators.minLength(3)])
                control.controls.breuDescripcioPartner.updateValueAndValidity({ emitEvent: false })

                if (!this.objectPartners['fotoPartner' + partnerArrayCounter]) {
                  control.controls.logoPartner.setValidators([Validators.required])
                  control.controls.logoPartner.updateValueAndValidity({ emitEvent: false })
                } else {
                  control.controls.logoPartner.clearValidators()
                  control.controls.logoPartner.updateValueAndValidity({ emitEvent: false })
                }

                control.updateValueAndValidity({ emitEvent: false });
              }
              else {

                control.controls.nomPartner.setValidators([Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomPartner.updateValueAndValidity({ emitEvent: false })


                control.controls.breuDescripcioPartner.setValidators([Validators.maxLength(900), Validators.minLength(3)])
                control.controls.breuDescripcioPartner.updateValueAndValidity({ emitEvent: false })


                control.controls.logoPartner.clearValidators()
                control.controls.logoPartner.updateValueAndValidity({ emitEvent: false })

                control.updateValueAndValidity({ emitEvent: false });

              }
            }
            partnerArrayCounter++;
          }

        } else if (abstractControl == this.repteForm.get('juratArray')) {

          let juratArrayCounter = 0;

          for (let control of (<FormArray>this.repteForm.get('juratArray')).controls) {
            if (control instanceof FormGroup) {

              if (control.controls.nomCognomsJurat.value ||
                control.controls.biografiaJurat.value ||
                this.objectJurats['fotoJurat' + juratArrayCounter]) {

                control.controls.nomCognomsJurat.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomCognomsJurat.updateValueAndValidity({ emitEvent: false })


                control.controls.biografiaJurat.setValidators([Validators.required, Validators.maxLength(900), Validators.minLength(3)])
                control.controls.biografiaJurat.updateValueAndValidity({ emitEvent: false })

                if (!this.objectJurats['fotoJurat' + juratArrayCounter]) {
                  control.controls.fotoJurat.setValidators([Validators.required])
                  control.controls.fotoJurat.updateValueAndValidity({ emitEvent: false })
                } else {
                  control.controls.fotoJurat.clearValidators()
                  control.controls.fotoJurat.updateValueAndValidity({ emitEvent: false })
                }

                control.updateValueAndValidity({ emitEvent: false });

              } else {

                control.controls.nomCognomsJurat.setValidators([Validators.maxLength(255), Validators.minLength(3)])
                control.controls.nomCognomsJurat.updateValueAndValidity({ emitEvent: false })


                control.controls.biografiaJurat.setValidators([Validators.maxLength(900), Validators.minLength(3)])
                control.controls.biografiaJurat.updateValueAndValidity({ emitEvent: false })


                control.controls.fotoJurat.clearValidators()
                control.controls.fotoJurat.updateValueAndValidity({ emitEvent: false })

                control.updateValueAndValidity({ emitEvent: false });

              }
            }
            juratArrayCounter++;
          }
        }
      }

    })

  }

  todayDate() {
    let today = new Date();
    today.setDate(today.getDate() + 1)
    let todayFormat = this.datepipe.transform(today, 'yyyy-MM-dd');

    return todayFormat;
  }

  tomorrowDate() {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    let tomorrowFormat = this.datepipe.transform(tomorrow, 'yyyy-MM-dd');

    return tomorrowFormat;
  }

  nextPrev(n) {
    this.currentTab = this.currentTab + n;
  }

  nextPrevBottom(n) {
    this.currentTab = this.currentTab + n;
    window.scrollTo(0, 0)
  }

  changeRadio(value) {
    this.radioValue = value;

  }

  changeRadioToS(value) {
    this.radioToSValue = value;

    if (this.radioToSValue == 'hubandrock') {

      this.repteForm.get('customTOS').setValidators([Validators.maxLength(5000), Validators.minLength(3)])
      this.repteForm.get('customTOS').updateValueAndValidity()

    } else if (this.radioToSValue == 'custom') {

      this.repteForm.get('customTOS').setValidators([Validators.required, Validators.maxLength(5000), Validators.minLength(3)])
      this.repteForm.get('customTOS').updateValueAndValidity()

    }
  }

  onPdfSelected(event) {
    console.log('total recursos size', this.totalRecursosSize);
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
    console.log(this.pdfArray)
  }

  deletePdf(index) {
    let confirmWindow = confirm('Estàs segur que vol eliminar aquest pdf?')

    if (confirmWindow == true) {
      this.totalRecursosSize = this.totalRecursosSize - this.pdfArray[index].size;
      this.pdfArray.splice(index, 1)
    }

  }

  onFileRepteFoto(event) {
    if (event.target.files) {
      if (event.target.files[0].size < 1000000) {
        const inputName = event.target.name;

        this.fotosRepte[inputName] = event.target.files[0]

        console.log(this.fotosRepte)

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event: any) => {
          this.fotosReptePreview[inputName] = reader.result
          console.log(this.fotosReptePreview)
        }
      } else {
        alert('L\'arxiu supera el límit de 1MB')
      }
    }
  }

  onFileSelected(event, index?) {
    if (event.target.files) {
      if (event.target.files[0].size < 1000000) {
        console.log('fiel pujat', event.target.files[0])
        let inputName = event.target.name;
        this.objectFotos[inputName] = event.target.files[0]

        console.log(inputName, index)

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event: any) => {
          this.objectFotosPreview[inputName] = reader.result
        }
      } else {
        alert('L\'arxiu supera el límit de 1MB')
      }
    }

  }

  onFileSelectedSolucio(event, index?) {
    if (event.target.files) {
      if (event.target.files[0].size < 1000000) {
        console.log('fiel pujat', event.target.files[0])
        let inputName = event.target.name;
        this.objectSolucions[inputName] = event.target.files[0]

        console.log(inputName, index)

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event: any) => {
          this.objectSolucionsPreview[inputName] = reader.result
        }
      } else {
        alert('L\'arxiu supera el límit de 1MB')
      }

    }
    console.log(this.objectSolucionsPreview)
  }

  onFileSelectedPartner(event, index?) {
    if (event.target.files) {
      if (event.target.files[0].size < 1000000) {
        console.log('file PARTNER pujat', event.target.files[0])
        let inputName = event.target.name;
        this.objectPartners[inputName] = event.target.files[0]

        console.log(inputName, index)

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event: any) => {
          this.objectPartnersPreview[inputName] = reader.result
        }
        this.logValidationErrors()

      } else {
        alert('L\'arxiu supera el límit de 1MB')
      }

    }
    console.log(this.objectPartnersPreview)
  }

  onFileSelectedJurat(event, index?) {
    if (event.target.files) {
      if (event.target.files[0].size < 1000000) {
        console.log('fiel pujat', event.target.files[0])
        let inputName = event.target.name;
        this.objectJurats[inputName] = event.target.files[0]

        console.log(inputName, index)

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (event: any) => {
          this.objectJuratsPreview[inputName] = reader.result
        }
        this.logValidationErrors()

      } else {
        alert('L\'arxiu supera el límit de 1MB')
      }

    }
    console.log(this.objectJuratsPreview)
  }


  eliminarFoto(fotoName) {
    console.log("INSIDEEEEEEEEEEEEEEEEEE TOOOOOOOOOOOOOO DEEEEEEEEEEEPPPPPPPPPP", fotoName)
    let str = fotoName;
    let arraySplit = str.split(/([0-9]+)/)  //fotoPremi

    if (arraySplit[0] == 'fotoPremi') {
      let confirmWindow = confirm('Estàs segur que vol eliminar aquesta foto?')

      if (confirmWindow == true) {
        this.objectFotosPreview[fotoName] = '';
        this.objectFotos[fotoName] = '';
      }
    }
    else if (arraySplit[0] == 'fotoSolucio') {
      let confirmWindow = confirm('Estàs segur que vol eliminar aquesta foto?')

      if (confirmWindow == true) {
        this.objectSolucionsPreview[fotoName] = '';
        this.objectSolucions[fotoName] = '';
      }
    }
    else if (arraySplit[0] == 'fotoPartner') {
      (<FormArray>this.repteForm.get('partnerArray')).at(arraySplit[1]).patchValue({
        logoPartner: null
      })

      let confirmWindow = confirm('Estàs segur que vol eliminar aquesta foto?')

      if (confirmWindow == true) {
        this.objectPartnersPreview[fotoName] = '';
        this.objectPartners[fotoName] = '';
        this.logValidationErrors()
      }
    }
    else if (arraySplit[0] == 'fotoJurat') {

      (<FormArray>this.repteForm.get('juratArray')).at(arraySplit[1]).patchValue({
        fotoJurat: null
      })

      let confirmWindow = confirm('Estàs segur que vol eliminar aquesta foto?')

      if (confirmWindow == true) {
        this.objectJuratsPreview[fotoName] = '';
        this.objectJurats[fotoName] = '';
        this.logValidationErrors()
      }

    } else {
      let confirmWindow = confirm('Estàs segur que vol eliminar aquesta foto?')

      if (confirmWindow == true) {
        this.fotosRepte[fotoName] = '';
        this.fotosReptePreview[fotoName] = '';
      }
    }

    this.logValidationErrors()
  }

  eliminarFotoArray(fotoName, i) {
    let str = fotoName;

    //Separem el nom de foto
    let arraySplit = str.split(/([0-9]+)/)  //fotoPremi
    let number = Number(arraySplit[1]);  //0

    if (arraySplit[0] == 'fotoPremi') {

      let confirmWindow = confirm('Estàs segur que vols eliminar aquests premi?')
      if (confirmWindow == true) {
        this.loopObjectFotosPreview(number, arraySplit[0]);
        this.loopObjectFotos(number, arraySplit[0]);
        this.removePremiButtonClick(i);
      }
    }
    else if (arraySplit[0] == 'fotoSolucio') {

      let confirmWindow = confirm('Estàs segur que vols eliminar aquesta solució?')
      if (confirmWindow == true) {
        this.loopObjectFotosPreviewSolucio(number, arraySplit[0]);
        this.loopObjectFotosSolucio(number, arraySplit[0]);
        this.removeSolucioButtonClick(i);
      }
    }
    else if (arraySplit[0] == 'fotoPartner') {

      let confirmWindow = confirm('Estàs segur que vols eliminar aquest partner?')
      if (confirmWindow == true) {
        this.loopObjectFotosPreviewPartner(number, arraySplit[0]);
        this.loopObjectFotosPartner(number, arraySplit[0]);
        this.removePartnerButtonClick(i);
        this.logValidationErrors();
      }

    }
    else if (arraySplit[0] == 'fotoJurat') {

      let confirmWindow = confirm('Estàs segur que vols eliminar aquest jurat?')
      if (confirmWindow == true) {
        this.loopObjectFotosPreviewJurat(number, arraySplit[0]);
        this.loopObjectFotosJurat(number, arraySplit[0]);
        this.removeJuratButtonClick(i);
        this.logValidationErrors()
      }

    }

    this.logValidationErrors()

  }

  addPremiToObject(inputName) {
    let str = inputName;
    let arraySplit = str.split(/([0-9]+)/)

    if (arraySplit[0] == 'fotoPremi') {
      if (!this.objectFotosPreview[inputName]) {
        this.objectFotosPreview[inputName] = '';
        this.objectFotos[inputName] = '';
      }
    }
    else if (arraySplit[0] == 'fotoSolucio') {
      if (!this.objectSolucionsPreview[inputName]) {
        this.objectSolucionsPreview[inputName] = '';
        this.objectSolucions[inputName] = '';
      }
    }
    else if (arraySplit[0] == 'fotoPartner') {
      if (!this.objectPartnersPreview[inputName]) {
        this.objectPartnersPreview[inputName] = '';
        this.objectPartners[inputName] = '';
      }
    }
    else if (arraySplit[0] == 'fotoJurat') {
      if (!this.objectJuratsPreview[inputName]) {
        this.objectJuratsPreview[inputName] = '';
        this.objectJurats[inputName] = '';
      }
    }

  }



  loopObjectFotosPreview(number, valueName) {
    console.log("FOTOPREMI QUE VOLEM ELIMINAR:" + valueName + number);
    let arrayLength = Object.keys(this.objectFotosPreview).length - 1

    for (const [key, value] of Object.entries(this.objectFotosPreview)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectFotosPreview[stringRestada] = this.objectFotosPreview[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectFotosPreview[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectFotosPreview)
  }

  loopObjectFotos(number, valueName) {

    console.log("FOTOPREMI QUE VOLEM ELIMINAR:" + valueName + number);
    let arrayLength = Object.keys(this.objectFotos).length - 1

    for (const [key, value] of Object.entries(this.objectFotos)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectFotos[stringRestada] = this.objectFotos[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectFotos[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectFotos)

  }


  addPremiFormGroup(): FormGroup {
    return this.fb.group({
      nomPremi: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      dotacioPremi: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(1)]],
      descripcioPremi: ['', [Validators.maxLength(900), Validators.minLength(3)]],
      fotoPremi: ['']
    })
  }

  addSolucioFormGroup(): FormGroup {
    return this.fb.group({
      nomSolucio: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      descripcioSolucio: ['', [Validators.required, Validators.maxLength(900), Validators.minLength(3)]],
      fotoSolucio: ['']
    })
  }

  addPartnerFormGroup(): FormGroup {
    return this.fb.group({
      nomPartner: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      breuDescripcioPartner: ['', [Validators.maxLength(900), Validators.minLength(3)]],
      logoPartner: [''],
    })
  }

  addJuratFormGroup(): FormGroup {
    return this.fb.group({
      nomCognomsJurat: ['', [Validators.maxLength(255), Validators.minLength(3)]],
      biografiaJurat: ['', [Validators.maxLength(900), Validators.minLength(3)]],
      fotoJurat: [''],
    })
  }

  addPreguntaFormGroup(): FormGroup {
    return this.fb.group({
      pregunta: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      resposta: ['', [Validators.required, Validators.maxLength(2000), Validators.minLength(3)]],
    })
  }

  addPremiButtonClick(): void {
    (<FormArray>this.repteForm.get('premiArray')).push(this.addPremiFormGroup());
  }

  addSolucioButtonClick(): void {
    (<FormArray>this.repteForm.get('solucioArray')).push(this.addSolucioFormGroup());
  }

  addPartnerButtonClick(): void {
    (<FormArray>this.repteForm.get('partnerArray')).push(this.addPartnerFormGroup());
  }

  addJuratButtonClick(): void {
    (<FormArray>this.repteForm.get('juratArray')).push(this.addJuratFormGroup());
  }

  addPreguntaButtonClick(): void {
    (<FormArray>this.repteForm.get('preguntaArray')).push(this.addPreguntaFormGroup());
  }

  removePremiButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('premiArray')).removeAt(partnerGroupIndex)
  }

  removeSolucioButtonClick(solucioGroupIndex: number): void {
    (<FormArray>this.repteForm.get('solucioArray')).removeAt(solucioGroupIndex)
  }

  removePartnerButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('partnerArray')).removeAt(partnerGroupIndex)
  }

  removeJuratButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('juratArray')).removeAt(partnerGroupIndex)
  }

  removePreguntaButtonClick(partnerGroupIndex: number): void {
    (<FormArray>this.repteForm.get('preguntaArray')).removeAt(partnerGroupIndex)
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {

    if (this.repteForm.dirty && !this.formDone) {
      $event.returnValue = true;
    }
  }

  ngOnDestroy() {
    this.subscriptionForm$?.unsubscribe()

  }

  changeCurrentTab(tabNumber) {
    this.currentTab = tabNumber;
  }

  checkboxvalues() {
    console.log("CHECKBOXES")
    console.log(this.repteForm.get('checkboxGroup').value)
    console.log(this.repteForm.get('checkboxGroup').value.empresesCheckbox)
  }

  appendRepte(): FormData {

    const formData = new FormData();

    if (this.repteForm.get('descripcioBreuRepte').value) {
      formData.append('descripcio_short', this.repteForm.get('descripcioBreuRepte').value);
    }

    if (this.repteForm.get('descripcioDetalladaRepte').value) {
      formData.append('descripcio_long', this.repteForm.get('descripcioDetalladaRepte').value);
    }

    if (this.repteForm.get('nomRepte').value) {
      formData.append('nom', this.repteForm.get('nomRepte').value);
    }

    if (this.repteForm.get('videoSolucio').value) {
      formData.append('url_video', this.repteForm.get('videoSolucio').value);

    }

    if (this.radioValue == "equip") {

      formData.append('individual_equip', '1')

      if (this.repteForm.get('limitParticipants').value) {

        formData.append('limit_participants', this.repteForm.get('limitParticipants').value)

      }

    } else {
      formData.append('individual_equip', '0');

    }

    if (this.radioToSValue == "custom") {
      formData.append('bases_legals', '1')
      if (this.repteForm.get('customTOS').value) {
        formData.append('bases_legals_personals', this.repteForm.get('customTOS').value)
      }
    } else {
      formData.append('bases_legals', '0');
    }

    if (this.repteForm.get('datesGroup').get('dataInici').value) {
      let iniciDate = this.datepipe.transform(this.repteForm.get('datesGroup').get('dataInici').value, 'dd/MM/yyyy')
      formData.append('data_inici', iniciDate)
    }

    if (this.repteForm.get('datesGroup').get('dataFinalitzacio').value) {
      let finalDate = this.datepipe.transform(this.repteForm.get('datesGroup').get('dataFinalitzacio').value, 'dd/MM/yyyy')
      formData.append('data_final', finalDate)
    }

    formData.append('participants[empreses]', (this.repteForm.get('checkboxGroup').value.empresesCheckbox))
    formData.append('participants[startups]', this.repteForm.get('checkboxGroup').value.startupsCheckbox)
    formData.append('participants[estudiants]', this.repteForm.get('checkboxGroup').value.estudiantsCheckbox)
    formData.append('participants[experts]', this.repteForm.get('checkboxGroup').value.expertsCheckbox)

    // APPENDING PREMI
    for (var i = 0; i < (<FormArray>this.repteForm.get('premiArray')).controls.length; i++) {

      if (this.repte.premis[i]) {
        formData.append(`idpremi[${i}]`, this.repte.premis[i].idpremi);
      }

      if (this.repteForm.get('premiArray').value[i].nomPremi) {
        formData.append(`premi_nom[${i}]`, this.repteForm.get('premiArray').value[i].nomPremi);
      } else {
        formData.append(`premi_nom[${i}]`, '');

      }
      if (this.repteForm.get('premiArray').value[i].dotacioPremi) {
        formData.append(`premi_dotacio[${i}]`, this.repteForm.get('premiArray').value[i].dotacioPremi);
      }
      if (this.repteForm.get('premiArray').value[i].descripcioPremi) {
        formData.append(`premi_descripcio[${i}]`, this.repteForm.get('premiArray').value[i].descripcioPremi);
      }

      let premiFotoName = 'fotoPremi' + i;

      if (this.objectFotos[premiFotoName]) {
        if (this.repteForm.get('premiArray').value[i].fotoPremi) {
          formData.append(`premi_url_photo[${i}]`, this.objectFotos[premiFotoName]);
        }
      } else {
        formData.append(`premi_url_photo_delete[${i}]`, '');

      }
    }

    //APPENDING SOLUCIO
    for (var i = 0; i < (<FormArray>this.repteForm.get('solucioArray')).controls.length; i++) {

      if (this.repte.solucions[i]) {
        formData.append(`idsolucio[${i}]`, this.repte.solucions[i].idsolucio);
      }

      if (this.repteForm.get('solucioArray').value[i].nomSolucio) {
        formData.append(`solucio_nom[${i}]`, this.repteForm.get('solucioArray').value[i].nomSolucio);
      } else {
        formData.append(`solucio_nom[${i}]`, '');

      }
      if (this.repteForm.get('solucioArray').value[i].descripcioSolucio) {
        formData.append(`solucio_descripcio[${i}]`, this.repteForm.get('solucioArray').value[i].descripcioSolucio);
      }

      let solucioFotoName = 'fotoSolucio' + i;
      console.log('putaaaaaaa', this.objectSolucions[solucioFotoName])
      if (this.objectSolucions[solucioFotoName] && this.objectSolucions[solucioFotoName] != undefined) {
        if (this.repteForm.get('solucioArray').value[i].fotoSolucio) {
          formData.append(`solucio_url_photo[${i}]`, this.objectSolucions[solucioFotoName]);
        }
      } else {
        formData.append(`solucio_url_photo_delete[${i}]`, '');

      }
    }

    //APPENDING PARTNER
    for (var i = 0; i < (<FormArray>this.repteForm.get('partnerArray')).controls.length; i++) {

      if (this.repte.partners[i]) {
        formData.append(`idpartner[${i}]`, this.repte.partners[i].idpartner);
      }

      if (this.repteForm.get('partnerArray').value[i].nomPartner) {
        formData.append(`partner_nom[${i}]`, this.repteForm.get('partnerArray').value[i].nomPartner);
      } else {
        formData.append(`partner_nom[${i}]`, '');

      }
      if (this.repteForm.get('partnerArray').value[i].breuDescripcioPartner) {
        formData.append(`partner_descripcio[${i}]`, this.repteForm.get('partnerArray').value[i].breuDescripcioPartner);
      }

      let partnerFotoName = 'fotoPartner' + i;

      if (this.objectPartners[partnerFotoName]) {
        if (this.repteForm.get('partnerArray').value[i].logoPartner) {
          formData.append(`partner_url_logo[${i}]`, this.objectPartners[partnerFotoName]);
        }
      } else {
        formData.append(`partner_url_logo_delete[${i}]`, '');

      }
    }

    //APPENDING JURAT
    for (var i = 0; i < (<FormArray>this.repteForm.get('juratArray')).controls.length; i++) {

      if (this.repte.jurats[i]) {
        formData.append(`idjurat[${i}]`, this.repte.jurats[i].idjurat);
      }

      if (this.repteForm.get('juratArray').value[i].nomCognomsJurat) {
        formData.append(`jurat_nom[${i}]`, this.repteForm.get('juratArray').value[i].nomCognomsJurat);
      } else {
        formData.append(`jurat_nom[${i}]`, '');

      }
      if (this.repteForm.get('juratArray').value[i].biografiaJurat) {
        formData.append(`jurat_bio[${i}]`, this.repteForm.get('juratArray').value[i].biografiaJurat);
      }

      let juratFotoName = 'fotoJurat' + i;

      if (this.objectJurats[juratFotoName]) {
        if (this.repteForm.get('juratArray').value[i].fotoJurat) {
          formData.append(`jurat_url_photo[${i}]`, this.objectJurats[juratFotoName]);
        }
      } else {
        formData.append(`jurat_url_photo_delete[${i}]`, '');

      }
    }

    //APPENDING FAQ
    for (var i = 0; i < (<FormArray>this.repteForm.get('preguntaArray')).controls.length; i++) {
      if (this.repteForm.get('preguntaArray').value[i].pregunta) {
        formData.append(`faq_pregunta[${i}]`, this.repteForm.get('preguntaArray').value[i].pregunta);
      }
      if (this.repteForm.get('preguntaArray').value[i].resposta) {
        formData.append(`faq_resposta[${i}]`, this.repteForm.get('preguntaArray').value[i].resposta);
      }
    }

    //APPENDING RECURSOS
    if (this.pdfArray.length) {
      for (let index = 0; index < this.pdfArray.length; index++) {
        const file = this.pdfArray[index];

        formData.append(`recurs_nom[${index}]`, file.name);
        formData.append(`recurs_url_fitxer[${index}]`, file);
      }
    }
    // else {
    //   formData.append(`recurs_url_fitxer_delete`, '');
    // }

    //APPENDING FOTOS REPTE
    if (this.fotosRepte.fotoPortada) {
      if (this.repteForm.get('fotoPortada').value) {
        formData.append(`url_photo_main`, this.fotosRepte.fotoPortada);
      }
    }

    if (this.fotosRepte.fotoRepresentativa1) {
      if (this.repteForm.get('fotoRepresentativa1').value) {
        formData.append(`url_photo_1`, this.fotosRepte.fotoRepresentativa1);
      }
    } else {
      formData.append(`url_photo_1_delete`, '');

    }

    if (this.fotosRepte.fotoRepresentativa2) {
      if (this.repteForm.get('fotoRepresentativa2').value) {
        formData.append(`url_photo_2`, this.fotosRepte.fotoRepresentativa2);
      }
    } else {
      formData.append(`url_photo_2_delete`, '');

    }

    if (this.fotosRepte.fotoRepresentativa3) {
      if (this.repteForm.get('fotoRepresentativa3').value) {
        formData.append(`url_photo_3`, this.fotosRepte.fotoRepresentativa3);
      }
    } else {
      formData.append(`url_photo_3_delete`, '');

    }


    return formData;
  }

  // desaBorrador() {

  //   if (!this.repteForm.get('nomRepte').value) {

  //     if (!this.formErrors.nomRepte) {
  //       this.formErrors.nomRepte += this.validationMessages.nomRepte.required + ' ';
  //     }

  //     if (!this.formErrors.campsErronis) {
  //       this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
  //     }

  //   } else if (this.repteForm.get('nomRepte').value.length < 3) {

  //     if (!this.formErrors.nomRepte) {
  //       this.formErrors.nomRepte += this.validationMessages.nomRepte.minlength + ' ';
  //     }

  //     if (!this.formErrors.campsErronis) {
  //       this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
  //     }

  //   } else if (this.repteForm.get('nomRepte').value.length > 255) {

  //     if (!this.formErrors.nomRepte) {
  //       this.formErrors.nomRepte += this.validationMessages.nomRepte.maxlength + ' ';
  //     }

  //     if (!this.formErrors.campsErronis) {
  //       this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
  //     }

  //   } else {
  //     this.formDone = true;

  //     if (this.formErrors.campsErronis) {
  //       this.formErrors.campsErronis = '';
  //     }

  //     let formData: any = this.appendRepte();

  //     for (var value of formData.values()) {
  //       console.log(value);
  //     }

  //     this.subscriptionHttp1$ = this.httpClient.editRepteEsborrany(this.idRepte, formData)
  //       .pipe(first())
  //       .subscribe(
  //         data => {
  //           console.log(data)
  //           if (data.code == 1) {
  //             this.success = true;
  //             this.actualitzat = true;
  //             // let currentUserId = JSON.parse(localStorage.getItem('currentUser')).idUser;
  //             // this.router.navigate([`/perfil/${currentUserId}`])
  //           }
  //         });
  //   }




  // }


  onRepteSubmit() {
    window.scrollTo(0, 0)

    this.checkUntouched = true;
    console.log(this.repteForm.get('checkboxGroup'))
    if (!this.repteForm.valid) {
      console.log(this.repteForm.valid)
      for (const field in this.repteForm.controls) { // 'field' is a string
        const control = this.repteForm.get(field).errors; // 'control' is a FormControl  
        console.log(field, control)
      }
      if (!this.formErrors.campsErronis) {
        this.formErrors.campsErronis += this.validationMessages.campsErronis.errors + ' ';
      }

      this.logValidationErrorsUntouched()

    } else {
      let confirmWindow = confirm('Està segur que vol actualitzar aquest repte?')

      if (confirmWindow == true) {
        this.formDone = true;

        if (this.formErrors.campsErronis) {
          this.formErrors.campsErronis = '';
        }

        let formData: any = this.appendRepte();

        for (var value of formData.values()) {
          console.log(value);
        }

        this.subscriptionHttp1$ = this.httpClient.editRepte(this.idRepte, formData)
          .pipe(first())
          .subscribe(
            data => {
              if (data.code == 1) {
                window.scrollTo(0, 0)
                this.toastr.success('Repte actualitzat i enviat per revisar!', 'Enviat')
                this.success = true;
                this.enviat = true;
              }

            });
      }

    }
  }

  deleteRepte() {
    this.subscriptionHttp1$ = this.httpClient.deleteRepte(this.idRepte)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == 1) {
            this.success = true;
            this.eliminat = true;
            this.toastr.success('Repte eliminat correctament', 'Eliminat')

          }

        });
  }

  logValidationErrorsUntouched(group: FormGroup = this.repteForm): void {
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


  loopObjectFotosPreviewSolucio(number, valueName) {
    let arrayLength = Object.keys(this.objectSolucionsPreview).length - 1

    for (const [key, value] of Object.entries(this.objectSolucionsPreview)) {
      let index = key.split(/([0-9]+)/)[1];
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectSolucionsPreview[stringRestada] = this.objectSolucionsPreview[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectSolucionsPreview[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectSolucionsPreview)
  }

  loopObjectFotosSolucio(number, valueName) {
    let arrayLength = Object.keys(this.objectSolucions).length - 1

    for (const [key, value] of Object.entries(this.objectSolucions)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectSolucions[stringRestada] = this.objectSolucions[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectSolucions[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectSolucions)

  }

  loopObjectFotosPreviewPartner(number, valueName) {
    let arrayLength = Object.keys(this.objectPartnersPreview).length - 1

    for (const [key, value] of Object.entries(this.objectPartnersPreview)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectPartnersPreview[stringRestada] = this.objectPartnersPreview[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectPartnersPreview[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectPartnersPreview)
  }

  loopObjectFotosPartner(number, valueName) {

    console.log("FOTOPREMI QUE VOLEM ELIMINAR:" + valueName + number);
    let arrayLength = Object.keys(this.objectPartners).length - 1

    for (const [key, value] of Object.entries(this.objectPartners)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectPartners[stringRestada] = this.objectPartners[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectPartners[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectPartners)

  }

  loopObjectFotosPreviewJurat(number, valueName) {
    console.log("FOTOPREMI QUE VOLEM ELIMINAR:" + valueName + number);
    let arrayLength = Object.keys(this.objectJuratsPreview).length - 1

    for (const [key, value] of Object.entries(this.objectJuratsPreview)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectJuratsPreview[stringRestada] = this.objectJuratsPreview[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectJuratsPreview[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectJuratsPreview)
  }

  loopObjectFotosJurat(number, valueName) {

    console.log("FOTOPREMI QUE VOLEM ELIMINAR:" + valueName + number);
    let arrayLength = Object.keys(this.objectJurats).length - 1

    for (const [key, value] of Object.entries(this.objectJurats)) {
      let index = key.split(/([0-9]+)/)[1];
      console.log("LOOP NÚMERO: " + index)
      if (index < number) {
        console.log("PREMI INFERIOR AL QUE VOLEM ELIMINAR")
      }
      if (index == number) {
        console.log("PREMI QUE VOLEM ELIMINAR")
      }
      if (index > number) {
        console.log("PREMI QUE VOLEM RESTAR")
        let resta = Number(index) - 1;
        let stringPassada = valueName + Number(index)
        let stringRestada = valueName + resta

        console.log("NUMERO ES MODIFICA DE: " + stringPassada + " A: " + stringRestada)

        this.objectJurats[stringRestada] = this.objectJurats[stringPassada]

      }
    }
    console.log("ULTIM OBJECTE: " + valueName + arrayLength)
    console.log("ELIMINANT ULTIM OBJECTE...")
    delete this.objectJurats[valueName + arrayLength];
    console.log("ArrayObject despres de manipular: ", this.objectJurats)

  }
}


// function dateGreaterThan(control: AbstractControl): { [key: string]: boolean } | null {

//   if (this.repteForm.get('dataFinalitzacio').value && this.repteForm.get('dataFinalitzacio').value) {

//     let dataFinal = new Date(this.repteForm.get('dataFinalitzacio').value);
//     let dataInici = new Date(this.repteForm.get('dataInici').value);

//     if (dataInici > dataFinal) {
//       return { 'dateGreaterThan': true }
//     }
//   }

//   return null;

// };


function dateShorterThanToday(control: AbstractControl): { [key: string]: any } | null {
  let date = new Date(control.value);
  let currentDate = new Date();

  if (control.value) {
    if (date > currentDate) {
      return null;
    }
    else {
      return { dateShorterThanToday: true }
    }
  } else {
    return null;
  }

}



function dateString(date) {
  var any = date.getFullYear();
  var mes = date.getMonth() + 1;
  var dia = date.getDate();

  return dia + "/" + mes + "/" + any
}



function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxesToBeChecked: true,
      };
    }

    return null;
  };
}

function dataIniciBiggerThanFinal(): ValidatorFn {
  return function validate(form: FormGroup) {
    let startDate = new Date(form.value.dataInici);
    let endDate = new Date(form.value.dataFinalitzacio);

    if (startDate >= endDate) {
      return {
        dataIniciBiggerThanFinal: true
      };
    }

    return null;
  };
}