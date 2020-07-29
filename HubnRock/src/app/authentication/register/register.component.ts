import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  accountType: number;
  register: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  registerNextStep(){
    this.register = 1
  }

  radioChangedHandler(event: any){
    this.accountType = event.target.value;
  }

}
