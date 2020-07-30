import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent implements OnInit {

  restoreForm: FormGroup;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.restoreForm = new FormGroup({
      email: new FormControl(),
    });

  }

  onRestore(): void {
    console.log(this.restoreForm.value)
  }
  

}
