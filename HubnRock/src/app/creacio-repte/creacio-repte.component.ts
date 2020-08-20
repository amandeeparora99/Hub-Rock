import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-creacio-repte',
  templateUrl: './creacio-repte.component.html',
  styleUrls: ['./creacio-repte.component.css']
})
export class CreacioRepteComponent implements OnInit {

  constructor(private builder: FormBuilder) { }

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.builder.group({
      dob: ['', Validators.required]
    });
  }

}
