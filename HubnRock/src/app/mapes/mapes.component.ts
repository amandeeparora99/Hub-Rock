import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapes',
  templateUrl: './mapes.component.html',
  styleUrls: ['./mapes.component.css']
})
export class MapesComponent implements OnInit {
  lat: number = 40;
  lng: number = -3;
  display = 'none';

  ngOnInit(): void {
  }

  displayChange(){
    if(this.display == 'none'){
      this.display = 'block';
    }
    else{
      this.display = 'none';
    }
  }

}
