import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-solucio',
  templateUrl: './solucio.component.html',
  styleUrls: ['./solucio.component.css']
})
export class SolucioComponent implements OnInit {

  constructor(private builder: FormBuilder) { }

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.builder.group({
      dob: ['', Validators.required]
    });
  }

}
