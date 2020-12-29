import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-per-empreses',
  templateUrl: './per-empreses.component.html',
  styleUrls: ['./per-empreses.component.css']
})
export class PerEmpresesComponent implements OnInit {

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
