import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-repte',
  templateUrl: './repte.component.html',
  styleUrls: ['./repte.component.css']
})
export class RepteComponent implements OnInit {

  constructor(public router: Router, public route: ActivatedRoute) { }

  public idRepte;
  
  ngOnInit(): void {
    
    let idRepte = parseInt(this.route.snapshot.paramMap.get('idrepte'));
    this.idRepte = idRepte;
    console.log(this.idRepte);
  }

  
  

}
