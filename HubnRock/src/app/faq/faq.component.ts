import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  public questions = [{
    faq_pregunta: 'Qui pot crear reptes a Hub & Rock?',
    faq_resposta: `Hub & Rock és una plataforma d’innovació oberta que permet 
    a les empreses crear reptes que solucionin problemes interns o que afecten a la societat en general. 
    Tot i així, no ens volem tancar a cap idea o problema a resoldre - per tant, si representes un organisme 
    públic o ets una startup, estudiant o expert i tens una idea de repte, contacta’ns a través del formulari 
    de contacte (clicant <a class="contactlink" href="/contactar">aquí</a>). Si el repte que proposes intenta resoldre un problema amb un gran impacte, 
    estudiarem el teu cas concret per publicar-lo. `
  },
  {
    faq_pregunta: 'Tinc una idea per un repte, però necessito ajuda per definir-lo. Què puc fer?',
    faq_resposta: `Hub & Rock posa a la teva disposició un equip multidisciplinari que t’ajudarà a definir tots 
    els aspectes del teu repte - les solucions buscades, les condicions legals, els premis, el disseny del repte, 
    la comunicació del repte, etc. Posa’t en contacte amb nosaltres (clicant <a class="contactlink" href="/contactar">aquí</a>) i t’assessorarem. `
  },
  {
    faq_pregunta: 'Per què no s’ha publicat el meu repte?',
    faq_resposta: `Tots els reptes de Hub & Rock han d’estar validats per la Cambra de Comerç de Girona. 
    Si el teu repte encara no s’ha publicat signfica que estem en procés de validar-lo. 
    T’avisarem en el moment de la publicació.`
  },
  {
    faq_pregunta: 'Puc modificar un repte ja creat?',
    faq_resposta: `No. Els reptes ja creats i validats no es poden modificar. 
    Per aquesta raó cada repte passa per un procés de validació per part de la Cambra de Comerç.`
  },
  {
    faq_pregunta: 'Qui pot participar en els reptes de Hub & Rock?',
    faq_resposta: `El creador del repte pot decidir qui pot participar en el seu repte: empreses, startups, estudiants, experts o tothom. 
    El nostre buscador et permet filtrar per reptes destinats a empreses, startups, estudiants o experts - d’aquesta manera trobaràs amb més 
    facilitat els reptes en els quals pots participar. `
  },
  {
    faq_pregunta: 'Puc participar amb més d’una solució?',
    faq_resposta: `Cada repte té les seves propies condicions. Et recomanem que llegeixis els termes i condicions i la descripció del repte 
    en el qual vols participar, ja que allà s’especifica si un mateix equip pot proposar més d’una solució. Si no hi has trobat aquesta 
    informació, contacta’ns clicant <a class="contactlink" href="/contactar">aquí</a>.`
  },
  {
    faq_pregunta: 'On s’anunciaran els guanyadors de cada repte?',
    faq_resposta: `Els guanyadors s’anunciaran a la pàgina del repte a Hub & Rock. També ho anunciarem a totes les nostres xarxes socials i 
    ens posarem en contacte amb els guanyadors. `
  },
  {
    faq_pregunta: 'Tinc una idea de solució, però no tinc equip. Què puc fer?',
    faq_resposta: `Et recomanem que participis en el repte, malgrat no tenir un equip format. Si la teva idea és guanyadora i la teva solució
     es desenvoluparà, el creador del repte et recolzarà en tot el procés d’implementació.`
  }]
  constructor() { }

  ngOnInit(): void {
  }

}
