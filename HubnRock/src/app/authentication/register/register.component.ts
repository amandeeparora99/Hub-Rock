import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  accountType: number;
  register: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nomEmpresa: new FormControl(),
      nomResponsable: new FormControl(),
      nomCorreu: new FormControl(),
      nomContrasenya: new FormControl(),
      nomRepeteixContrasenya: new FormControl(),
      nomNifEmpresa: new FormControl()
    });
  }

  registerNextStep(){
    this.register = 1
  }

  radioChangedHandler(event: any){
    this.accountType = event.target.value;
  }

}
