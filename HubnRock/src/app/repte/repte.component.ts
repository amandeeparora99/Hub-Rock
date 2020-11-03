import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { User } from '../user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-repte',
  templateUrl: './repte.component.html',
  styleUrls: ['./repte.component.css']
})
export class RepteComponent implements OnInit {

  constructor(public router: Router, public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService) { }

  public fileStorageUrl = environment.api + '/image/';
  public idRepte = null;
  public repte = null;

  public forum = null;
  public forumRespostes = null;
  objectRespostes: any = {};
  objectButtonsInput: any = {};

  public repteExists = true;
  videoUrl;
  public currentUser: User;

  public textAreaOn: Boolean = false;
  public forumButtonText = '+ Fes una publicació';

  public solucionsProposades = [];

  currentSolucionsProposadesPage = 1;
  elements = 6;

  solucionsProposadesNoMore = false;

  subscriptionHttp$: Subscription
  subscriptionHttp2$: Subscription
  subscriptionHttp3$: Subscription
  subscriptionHttp4$: Subscription

  ngOnInit(): void {

    this.httpCommunication.currentUser.subscribe(
      data => {
        this.currentUser = data;
      }
    );

    this.idRepte = this.aRouter.snapshot.params.id;
    if (this.idRepte) {
      this.getRepteFromComponent(this.idRepte);
      this.getRepteForum(this.idRepte, 1, 10);
    }

  }

  canParticipate(): Boolean {
    // només si està en procès i és vàlid
    if (this.currentUser && this.repte) {
      if (!this.isValid()) {
        return false;
      } else {
        if (this.repteEnProces()) {
          return true;
        } else {
          return false;
        }
      }
    }

  }

  canEdit(): Boolean {
    // només abans de la data d'inici, que sigui el creador, tot depenent de l'estat
    if (this.currentUser && this.repte) {
      if (!this.isValid()) {
        if (this.currentUser.idUser && this.currentUser.idUser == this.repte.user_iduser) {
          return true;
        } else {
          return false;
        }
      } else {
        if (this.currentUser.idUser && this.currentUser.idUser == this.repte.user_iduser && this.beforeDateInici()) {
          return true;
        } else {
          return false;
        }
      }
    }

  }

  canDelete(): Boolean {
    // depenent de l'estat, que sigui creador, només abans de la data d'inici
    if (this.currentUser && this.repte) {
      if (!this.isValid()) {
        if (this.currentUser.idUser && this.currentUser.idUser == this.repte.user_iduser) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

  }

  repteEnProces(): Boolean {
    // comprovar que el repte està en procès
    let dateIniciRepte = new Date(this.repte.data_inici);
    let dateFinalRepte = new Date(this.repte.data_final);
    let currentDate = new Date();

    if (dateIniciRepte < currentDate && dateFinalRepte > currentDate) {
      return true;
    } else {
      return false;
    }
  }

  beforeDateInici(): Boolean {
    // comprovar que el repte encara no esta en proces
    let dateIniciRepte = new Date(this.repte.data_inici);
    let currentDate = new Date();

    if (dateIniciRepte > currentDate) {
      return true;
    } else {
      return false;
    }
  }

  isEsborrany(): Boolean {
    if (this.repte.estat_idestat == 1) {
      return true;
    } else {
      return false;
    }
  }

  isValid(): Boolean {
    if (this.repte.estat_idestat == 3) {
      return true;
    } else {
      return false;
    }
  }

  isRebutjat(): Boolean {
    if (this.repte.estat_idestat == 4) {
      return true;
    } else {
      return false;
    }
  }

  isPendent(): Boolean {
    if (this.repte.estat_idestat == 2) {
      return true;
    } else {
      return false;
    }
  }

  getRepteFromComponent(id) {
    console.log("getRepteFromComponent")
    this.subscriptionHttp$ = this.httpCommunication.getRepte(id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            this.repte = data.row
            this.repteExists = true;



            this.getSolucionsProposades(this.currentSolucionsProposadesPage, this.elements)
          } else if (data.code == '2') {
            this.repteExists = false;
            // this.router.navigate(['/page-not-found'])
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
  }

  getRepteForum(idRepte, page, elements) {
    console.log("getRepteForum")
    this.subscriptionHttp2$ = this.httpCommunication.getForum(idRepte, page, elements)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            this.forum = data.rows

          } else {
            console.log("Forum ERROR")
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });

  }

  seeMoreSolucionsProposades() {
    this.currentSolucionsProposadesPage = this.currentSolucionsProposadesPage + 1;
    this.getSolucionsProposades(this.currentSolucionsProposadesPage, this.elements)
  }

  getSolucionsProposades(page, elements) {
    console.log(page, elements)
    this.subscriptionHttp$ = this.httpCommunication.getSolucionsByRepte(this.idRepte, page, elements).pipe(first())
      .subscribe(data => {
        if (data.code == "1") {

          for (let index = 0; index < data.rows.length; index++) {
            const solucioProposada = data.rows[index];

            this.solucionsProposades.push(solucioProposada)

            if (index < 5) {
              this.solucionsProposadesNoMore = true;
            } else {
              this.solucionsProposadesNoMore = false;
            }
          }
        }
      })
  }

  deleteRepte() {
    let confirmWindow = confirm('Esta segur que vol eliminar aquest repte?')

    if (confirmWindow == true) {
      if (this.idRepte && this.canDelete()) {

        this.httpCommunication.deleteRepte(this.idRepte).pipe(first())
          .subscribe(data => {
            if (data.code == 1) {
              if (this.currentUser) {
                this.router.navigate([`/perfil/${this.currentUser.idUser}`])
              }
            }
          })

      }
    }

  }

  ngOnDestroy() {
    this.subscriptionHttp$?.unsubscribe()
  }

  getImage(idparticipants) {
    if (idparticipants == 1) {
      return '../../assets/illustrations/Company.png';
    }
    else if (idparticipants == 2) {
      return '../../assets/illustrations/Startup.png';
    }
    else if (idparticipants == 3) {
      return '../../assets/illustrations/Student.png';
    }
    else if (idparticipants == 4) {
      return '../../assets/illustrations/Experts.png';
    }
  }

  diesRestants(data_inici, data_final) {
    if (data_inici && data_final) {
      let dateInici = new Date(data_inici);
      let dateFinal = new Date(data_final);
      let currentDate = new Date();

      if (dateInici > currentDate) {
        let days = Math.floor((dateInici.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        return "Inicia en " + days + " dies";
      }
      else if (dateInici < currentDate && dateFinal > currentDate) {
        let days = Math.floor((dateFinal.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
        return "Tenca en " + days + " dies";
      }
      else {
        let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
        if (days > 30) {
          return "Tencat fa mesos";
        }
        else {
          return "Tencat fa " + days + " dies";
        }

      }
    }


  }

  getYoutubeUrl(url) {
    if (url) {
      var string = url;
      var split = string.split('watch?v=');
      return "https://www.youtube.com/embed/" + split[1]
    }

  }

  switchTextArea(){
    if(!this.textAreaOn) {
      this.textAreaOn = true;
      this.forumButtonText = '+ Publica'
    }
    else {
      console.log("ENVIANT FORUM")
    }
    
  }

  carregarRespostes(idMissatgePare) {

    if(!this.objectRespostes["forumParent" + idMissatgePare]) {
      this.subscriptionHttp3$ = this.httpCommunication.getForumRespostes(idMissatgePare)
      .pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            let variableName = "forumParent" + idMissatgePare;
            this.objectRespostes[variableName] = data.rows;
            console.log("RESPOSTES:", this.objectRespostes[variableName])
          } else {
            console.log("Forum ERROR")
          }
        },
        error => {
          //this.error = error;
          //this.loading = false;
        });
    }
    else{
      console.log("Already loaded!")
    }
    
  }

  contestar(idResposta){
    //Posem tots els inputs en false again i nomes activem el que ha apretat nou l'user.
    for (const [key, value] of Object.entries(this.objectButtonsInput)) {
      console.log(key, value);
      if(value == true) {
        this.objectButtonsInput[key] = false
      }
    }
    this.objectButtonsInput[idResposta] = true;
  }

  returnTrue(idResposta){
    if(this.objectButtonsInput[idResposta]) {
      return this.objectButtonsInput[idResposta]
    }
    else {
      return false;
    }
  }

  sendMessage(message, topicId, messageParentId) {
    console.log(message)
    const formData = new FormData();
    formData.append('message', message);
    formData.append('topicId', topicId);
    if(messageParentId) {
      formData.append('messageParentId', messageParentId);

      this.subscriptionHttp4$ = this.httpCommunication.sendForumMessage(formData)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          alert("Missatge enviat correctament!");
        },
        error => {
          console.log("Fail")
          alert("S'ha produït un error");
        });
    }
    else{
      this.subscriptionHttp4$ = this.httpCommunication.sendForumMessage(formData)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          alert("Missatge enviat correctament!");
        },
        error => {
          console.log("Fail")
          alert("S'ha produït un error");
        });
    }
  
  }

  sendTopic(message) {
    console.log(message);

    const formData = new FormData();
    formData.append('message', message);

    this.subscriptionHttp4$ = this.httpCommunication.sendForumTopic(this.idRepte, formData)
    .pipe(first())
    .subscribe(
      data => {
        console.log(data);
        alert("Missatge enviat correctament!");
      },
      error => {
        console.log("Fail")
        alert("S'ha produït un error");
      });
  }

}
