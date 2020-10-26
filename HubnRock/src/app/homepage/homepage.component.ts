import { Component, OnInit } from '@angular/core';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { User } from '../user';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  userForm: FormGroup;
  allReptes = [];
  currentUser: User;
  inputValue;
  success = false;

  tags = [];
  subscriptionHttp$: Subscription;
  subscriptionHttp1$: Subscription;

  constructor(private httpCommunication: HttpCommunicationService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.httpCommunication.currentUser.subscribe(
      data => {
        this.currentUser = data;
      }
    );

    this.userForm = this.fb.group({
      InputfotoPerfilLogin: ['',],
      inputSobreTu: ['',],
      inputUbicacio: ['',],
      inputTags: ['',],
      inputExperiencia: ['',],
      inputEducacio: ['',],
      inputCV: ['',],
      inputLinkedIn: ['',],
      inputTwitter: ['',],
      inputInstagram: ['',],
      inputFacebook: ['',],
    })

    this.getAllReptesHomepage();

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
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  onSubmit() {

    let formData = this.appendUserInfo();

    this.subscriptionHttp1$ = this.httpCommunication.editShortUser(formData)
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

  confirmQuit(){
    let omplert: boolean = false;
    
    for(const field in this.userForm.controls){
      if(field != '') {
        omplert = true;
      }
    }

    if(omplert) {
      confirm("Tens camps omplerts, segur que vols sortir?")
    }
  }

  appendUserInfo(): FormData {
    const formData = new FormData();

    if (this.userForm.get('InputfotoPerfilLogin').value) {
      formData.append('url_photo_profile', this.userForm.get('InputfotoPerfilLogin').value);
    }

    if (this.userForm.get('inputSobreTu').value) {
      formData.append('bio', this.userForm.get('inputSobreTu').value);
    }

    if (this.userForm.get('inputUbicacio').value) {
      formData.append('ubicacio', this.userForm.get('inputUbicacio').value);
    }

    // if (this.userForm.get('inputUbicacio').value) {  TAGS?
    //   formData.append('ubicacio', this.userForm.get('ubicacio').value);
    // }

    if (this.userForm.get('inputExperiencia').value) {
      formData.append('experiencia', this.userForm.get('inputExperiencia').value);
    }

    if (this.userForm.get('inputEducacio').value) {
      formData.append('educacio', this.userForm.get('inputEducacio').value);
    }

    if (this.userForm.get('inputCV').value) {
      formData.append('cv_path', this.userForm.get('inputCV').value);
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

    return formData;
    
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


