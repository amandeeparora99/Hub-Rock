import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre-hubandrock',
  templateUrl: './sobre-hubandrock.component.html',
  styleUrls: ['./sobre-hubandrock.component.css']
})
export class SobreHubandrockComponent implements OnInit {

  private imagesArray = [
    `../../assets/testpics/1.png`,
    `../../assets/testpics/2.png`,
    `../../assets/testpics/3.png`,
  ]
  public imageToShow;
  public activeTab;

  constructor() { }

  ngOnInit(): void {
    this.imageToShow = this.imagesArray[0];
    this.activeTab = 0;
  }

  changeImageToShow(index: number) {
    this.imageToShow = this.imagesArray[index]
    this.activeTab = index;
  }

}
