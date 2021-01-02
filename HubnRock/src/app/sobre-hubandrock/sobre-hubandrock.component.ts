import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre-hubandrock',
  templateUrl: './sobre-hubandrock.component.html',
  styleUrls: ['./sobre-hubandrock.component.css']
})
export class SobreHubandrockComponent implements OnInit {

  private imagesArray = [
    `https://dummyimage.com/403x512/000/fff`,
    `https://dummyimage.com/403x513/000/fff`,
    `https://dummyimage.com/403x514/000/fff`,
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
