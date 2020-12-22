import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  public questions = [{
    faq_pregunta: 'Qui té els drets sobre el projecte presentat?',
    faq_resposta: `Lorem Ipsum es simplemente el texto de relleno 
  de las imprentas y archivos de texto. Lorem Ipsum ha sido el 
  texto de relleno estándar de las industrias desde el año 1500,
  cuando un impresor (N. del T. persona que se dedica a la imprenta)
  desconocido usó una galería de textos y los mezcló de tal manera 
  que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años. 
  \n
  Lorem Ipsum es simplemente el texto de relleno de las imprentas y 
  archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar
  de las industrias desde el año 1500, cuando un impresor (N. del T.
  persona que se dedica a la imprenta) desconocido usó una galería
  de textos y los mezcló de tal manera que logró hacer un libro de
  textos especimen. No sólo sobrevivió 500 años. `
  },
  {
    faq_pregunta: 'Segona pregunta?',
    faq_resposta: `segona reposta, aquesta resposta és diferent
    a les altres. `
  },
  {
    faq_pregunta: 'Tercera pregunta my friend?',
    faq_resposta: `Lorem Ipsum es simplemente el texto de relleno 
  de las imprentas y archivos de texto. Lorem Ipsum ha sido el 
  texto de relleno estándar de las industrias desde el año 1500,
  cuando un impresor (N. del T. persona que se dedica a la imprenta)
  desconocido usó una galería de textos y los mezcló de tal manera 
  que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años. 
  \n
  Lorem Ipsum es simplemente el texto de relleno de las imprentas y 
  archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar
  de las industrias desde el año 1500, cuando un impresor (N. del T.
  persona que se dedica a la imprenta) desconocido usó una galería
  de textos y los mezcló de tal manera que logró hacer un libro de
  textos especimen. No sólo sobrevivió 500 años. `
  }]
  constructor() { }

  ngOnInit(): void {
  }

}
