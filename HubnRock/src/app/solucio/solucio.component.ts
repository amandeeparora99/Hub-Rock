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

  nextPrev(n) {
    // // This function will figure out which tab to display
    // var x = document.getElementsByClassName("tab");
    // // Exit the function if any field in the current tab is invalid:
    // if (n == 1 && !validateForm()) return false;
    // // Hide the current tab:
    // x[currentTab].style.display = "none";
    // // Increase or decrease the current tab by 1:
    // currentTab = currentTab + n;
    // // if you have reached the end of the form...
    // if (currentTab >= x.length) {
    //   // ... the form gets submitted:
    //   document.getElementById("regForm").submit();
    //   return false;
    // }
    // // Otherwise, display the correct tab:
    // showTab(currentTab);
  }
}
