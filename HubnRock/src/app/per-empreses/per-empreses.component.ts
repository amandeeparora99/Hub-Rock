import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-per-empreses',
  templateUrl: './per-empreses.component.html',
  styleUrls: ['./per-empreses.component.css']
})
export class PerEmpresesComponent implements OnInit {

  private textArray = [
    `A través dels teus reptes d’innovació atrauràs el millor talent local, amb qui podràs col·laborar a curt i llarg termini, i inclòs podrà formar part del vostre equip. `,
    `Hub & Rock et permet descobrir noves tecnologies i serveis, i la nostra comunitat et recolzarà en el disseny, desenvolupament i implementació de solucions innovadores. `,
    `Dóna a conèixer els valors i la missió de la teva empresa i comunica eficaçment tot el que esteu assolint. `,
    `Amplia i millora els productes i serveis de la teva empresa a través de reptes d’innovació, accelerant el procés de creació i implementació i reduïnt els riscos. `,
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
