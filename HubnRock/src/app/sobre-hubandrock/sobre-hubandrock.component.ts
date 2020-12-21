import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre-hubandrock',
  templateUrl: './sobre-hubandrock.component.html',
  styleUrls: ['./sobre-hubandrock.component.css']
})
export class SobreHubandrockComponent implements OnInit {

  private textArray = [
    `Atraure talent Atraure talent Atraure talent Atraure talent
    Atraure talent Atraure talent Atraure talent Atraure talent
    Atraure talent Atraure talent Atraure talent Atraure talent`,
    `Gestió de la innovació Gestió de la innovació  Gestió de la innovació 
    Gestió de la innovació Gestió de la innovació Gestió de la innovació 
    Gestió de la innovació Gestió de la innovació Gestió de la innovació `,
    `Marketing i comunicació Marketing i comunicació Marketing i comunicació 
    Marketing i comunicació Marketing i comunicació Marketing i comunicació 
    Marketing i comunicació Marketing i comunicació Marketing i comunicació `,
    `Gestió del canvi Gestió del canvi Gestió del canvi Gestió del canvi 
    Gestió del canvi Gestió del canvi Gestió del canvi Gestió del canvi 
    Gestió del canvi Gestió del canvi Gestió del canvi Gestió del canvi `,
  ]
  public textToShow;
  public activeTab;

  constructor() { }

  ngOnInit(): void {
    this.textToShow = this.textArray[0];
    this.activeTab = 0;
  }

  changeTextToShow(index: number) {
    this.textToShow = this.textArray[index]
    this.activeTab = index;
  }
}
