import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent implements OnInit {

  restoreForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.restoreForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    
  }

  onRestore(): void {
    // console.log(this.restoreForm.value)
    // console.log(this.restoreForm.get('email').errors)
    // console.log(this.restoreForm.get('email').touched)
    // console.log(this.restoreForm.get('email').dirty)

  }
  

}
