import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { User } from '../user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public fileStorageUrl = environment.api + '/image/';

  userForm: FormGroup;
  allReptes = [];
  currentUser: User;
  userIsRockstar: Boolean;
  inputValue;
  success = false;
  usuariObject;
  // currentUserImage: File;

  pdfArray = [];
  fotoPerfilPreview;
  fotoPerfil;

  tags = [];
  subscriptionHttp$: Subscription;
  subscriptionHttp1$: Subscription;
  subscriptionHttp2$: Subscription;

  constructor(private httpCommunication: HttpCommunicationService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.httpCommunication.currentUser.subscribe(
      data => {
        this.currentUser = data;
        if (this.currentUser) {
          this.userIsRockstar = this.currentUser.userType;
          this.subscriptionHttp$ = this.httpCommunication.getUser(this.currentUser.idUser)
            .pipe(first())
            .subscribe(
              data => {
                if (data.code == "1") {
                  this.usuariObject = data.row;

                  // fetch(this.fileStorageUrl + this.usuariObject.url_photo_profile)
                  //   .then(res => res.blob()) // Gets the response and returns it as a blob
                  //   .then(blob => {
                  //     this.currentUserImage = new File([blob], 'image');
                  //   })
                }
              });
          if (this.currentUser.firstLogin) {
            this.openModal();
            this.changeUserFirstLogin();
          }
        }
      }
    );

    this.userForm = this.fb.group({
      InputfotoPerfilLogin: ['',],
      inputSobreTu: ['',],
      inputUbicacio: ['',],
      inputTags: ['',],
      inputExperiencia: ['',],
      inputEducacio: ['',],
      inputOcupacio: ['',],
      inputCV: ['',],
      inputLinkedIn: ['',],
      inputTwitter: ['',],
      inputInstagram: ['',],
      inputFacebook: ['',],
    })

    this.getAllReptesHomepage();

  }

  openModal() {
    document.getElementById("openModalButton").click();
  }

  getAllReptesHomepage() {
    this.subscriptionHttp$ = this.httpCommunication.getReptesOberts(1, 10)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data.rows);
          if (data.code == "1") {
            this.allReptes = data.rows;

          }
        });
  }

  changeUserFirstLogin() {
    //Un cop enviat ja no sera el primer cop que entra
    let first_login = 0;
    this.subscriptionHttp2$ = this.httpCommunication.changeFirstLogin(first_login)
      .pipe(first())
      .subscribe(
        data => {
          this.success = true;
          console.log(data);
        },
        error => {
          console.log("Fail")
        });
  }

  onSubmit() {
    //UPLOAD PROFILE PIC
    const profilePicFormData = new FormData;
    profilePicFormData.append('url_photo_profile', this.fotoPerfil);

    this.subscriptionHttp1$ = this.httpCommunication.uploadImageShortEdit(profilePicFormData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == 1) {
            this.success = true;

          }
        });

    let formData = this.appendUserInfo();

    this.subscriptionHttp1$ = this.httpCommunication.editShortUser(formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == 1) {
            this.toastr.success('Les teves dades s\'han actualitzat correctament', 'Desat')
            this.success = true;
            console.log(data);
          }
        }
      );
  }

  onFileSelected(event) {
    if (event.target.files) {

      this.fotoPerfil = event.target.files[0]

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0])

      reader.onload = (event: any) => {
        this.fotoPerfilPreview = event.target.result
      }


    }

  }

  eliminarFoto() {
    let confirmWindow = confirm('Estàs segur que vols eliminar aquesta foto?')
    if (confirmWindow == true) {
      this.fotoPerfilPreview = null;
      this.fotoPerfil = null;
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

  confirmQuit() {

    let omplert: Boolean = false;

    for (const field in this.userForm.controls) {
      const control = this.userForm.get(field).value;
      if (control) {
        omplert = true;
      }
    }

    this.changeUserFirstLogin();
  }

  appendUserInfo(): FormData {
    const formData = new FormData();

    if (!this.userIsRockstar) {  //LOGGED AS EMPRESA
      formData.append('empresa_rockstar', '0');

      if (this.userForm.get('inputSobreTu').value) {
        formData.append('bio', this.userForm.get('inputSobreTu').value);
      }

      if (this.userForm.get('inputUbicacio').value) {
        formData.append('ubicacio', this.userForm.get('inputUbicacio').value);
      }

      if (this.tags.length) {
        for (var i = 0; i < this.tags.length; i++) {
          formData.append(`servei_nom[${i}]`, this.tags[i]);
        }
      }

      if (this.userForm.get('inputLinkedIn').value) {
        formData.append('xarxes_linkedin', this.userForm.get('inputLinkedIn').value);
      }

      if (this.userForm.get('inputTwitter').value) {
        formData.append('xarxes_twitter', this.userForm.get('inputTwitter').value);
      }

      if (this.userForm.get('inputInstagram').value) {
        formData.append('xarxes_instagram', this.userForm.get('inputInstagram').value);
      }

      if (this.userForm.get('inputFacebook').value) {
        formData.append('xarxes_facebook', this.userForm.get('inputFacebook').value);
      }
      if (this.pdfArray.length) {
        formData.append(`cv_path`, this.pdfArray[0]);
        // formData.append(`recurs_url_fitxer[${index}]`, file);
      }
      return formData;
    }

    else if (this.userIsRockstar) {  //LOGGED AS ROCKSTAR
      formData.append('empresa_rockstar', '1');

      if (this.userForm.get('inputSobreTu').value) {
        formData.append('bio', this.userForm.get('inputSobreTu').value);
      }

      if (this.userForm.get('inputUbicacio').value) {
        formData.append('ubicacio', this.userForm.get('inputUbicacio').value);
      }

      if (this.tags.length) {
        for (var i = 0; i < this.tags.length; i++) {
          formData.append(`habilitat_nom[${i}]`, this.tags[i]);
        }
      }

      if (this.userForm.get('inputExperiencia').value) {
        formData.append('experiencia', this.userForm.get('inputExperiencia').value);
      }

      if (this.userForm.get('inputEducacio').value) {
        formData.append('educacio', this.userForm.get('inputEducacio').value);
      }

      if (this.userForm.get('inputOcupacio').value) {
        formData.append('ocupacio', this.userForm.get('inputOcupacio').value);
      }

      if (this.userForm.get('inputLinkedIn').value) {
        formData.append('xarxes_linkedin', this.userForm.get('inputLinkedIn').value);
      }

      if (this.userForm.get('inputTwitter').value) {
        formData.append('xarxes_twitter', this.userForm.get('inputTwitter').value);
      }

      if (this.userForm.get('inputInstagram').value) {
        formData.append('xarxes_instagram', this.userForm.get('inputInstagram').value);
      }

      if (this.userForm.get('inputFacebook').value) {
        formData.append('xarxes_facebook', this.userForm.get('inputFacebook').value);
      }

      if (this.pdfArray.length) {
        formData.append(`cv_path`, this.pdfArray[0]);
        // formData.append(`recurs_url_fitxer[${index}]`, file);
      }

      return formData;
    }

  }

  redirectRepte(idrepte) {
    let url: string = "/repte"
    this.router.navigate([url, idrepte]);
  }

  diesRestants(data_inici) {
    let date = new Date(data_inici);
    let currentDate = new Date();

    let days = Math.floor((date.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);

    if (days > 0) {
      return days + " dies restants";
    }
    else {
      return "Comença demà!"
    }

  }

  returnDaydddMMMyyy(day) {
    var d = day.toString();
    var array;
    var nd;
    array = d.split('/');

    nd = array[1] + "/" + array[0] + "/" + array[2]

    return nd;
  }

  onSearchChange(searchValue: string): void {
    if (searchValue.slice(-1) == ',') {
      this.addTag(searchValue.slice(0, -1))
      console.log(searchValue.slice(0, -1) + ": added to string")
      this.inputValue = ''
    }
  }

  addTag(string) {
    this.tags.push(string);
  }

  getTags() {
    console.log(this.tags)
  }

  addTagSubmit(string) {
    this.tags.push(string);
    this.inputValue = ''
  }

  deleteTag(tagName) {
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i] === tagName) {
        this.tags.splice(i, 1);
      }
    }
    console.log(this.tags)
  }

  ngOnDestroy() {
    this.subscriptionHttp$?.unsubscribe()
  }



}


