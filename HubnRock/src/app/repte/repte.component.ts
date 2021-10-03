import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { HttpCommunicationService } from '../reusable/httpCommunicationService/http-communication.service';
import { first } from 'rxjs/operators';
import { User } from '../user';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-repte',
  templateUrl: './repte.component.html',
  styleUrls: ['./repte.component.css']
})
export class RepteComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, public router: Router, public aRouter: ActivatedRoute, public httpCommunication: HttpCommunicationService,
    public toastr: ToastrService) { }

  public fileStorageUrl = environment.api + '/image/';
  public idRepte = null;
  public repte = null;
  public topicPost;
  public buttonDisabled: Boolean = false;

  public guanyadorPage = 0;
  public forum = null;
  public forumRespostes = null;
  public hasForum: Boolean = false;
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
  subscriptionHttp5$: Subscription
  subscriptionHttp6$: Subscription
  subscriptionHttp7$: Subscription

  solucionsGuanyadoresObj = {};
  solucionsGuanyadoresFinal = {};

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

  getRepteGuanyadors(){
    if(this.repte.premis[0].guanyador){
      this.repte.premis.forEach(premi => {
        this.solucionsProposades.forEach(solucio => {
          // console.log(premi.guanyador + ", " + solucio.idsolucio_proposada)
          if(premi.guanyador == solucio.idsolucio_proposada){
            this.solucionsGuanyadoresFinal[premi.premi_nom] = solucio
          }
        });
      });
      console.log(this.solucionsGuanyadoresFinal)
    }
    else{
      console.log("No te guanyadors!")
    }
  }

  canParticipate(): Boolean {
    // només si està en procès i és vàlid
    if (this.repte) {
      if (!this.isValid()) {
        return false;
      } else {
        return true;
      }
    }
  }

  isRepteOwner(): Boolean {
    if(this.currentUser){  //If logged in, check if owner
      if(this.currentUser.idUser == this.repte.user_iduser){
        return true;
      }
      else{
        return false;
      }
    }
    else{  //If not logged in, return false
      return false;
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
        return false
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

  repteAcabat(): Boolean {
    let dateFinalRepte = new Date(this.repte.data_final);
    let currentDate = new Date();

    if (currentDate > dateFinalRepte) {
      return true;
    } else {
      return false;
    }
  }

  premiCurt(text){
    var string = text;
    var length = 15;
    var trimmedString = string.substring(0, length);

    if(text.length > 7){
      return trimmedString+"...";
    }
    else{
      return string;
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
        });
  }

  getRepteForum(idRepte, page, elements) {
    if (this.httpCommunication.loggedIn()) {
      this.subscriptionHttp2$ = this.httpCommunication.getForumLogin(idRepte, page, elements)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == '1') {
              this.forum = data.rows
              if (this.forum.length > 0) {
                this.hasForum = true;
              }
            } else {
              // console.log("Forum ERROR")
            }
          },
          error => {
            //this.error = error;
            //this.loading = false;
          });
    }
    else {
      this.subscriptionHttp2$ = this.httpCommunication.getForum(idRepte, page, elements)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == '1') {
              this.forum = data.rows
              if (this.forum.length > 0) {
                this.hasForum = true;
              }
            } else {
              // console.log("Forum ERROR")
            }
          },
          error => {
            //this.error = error;
            //this.loading = false;
          });
    }
  }
  

  forumDateToText(dateString) {
    let split = dateString.split('/')
    let month;

    switch (split[1]) {
      case '01':
        month = 'Gener'
        break;
      case '02':
        month = 'Febrer'
        break;
      case '03':
        month = 'Març'
        break;
      case '04':
        month = 'Abril'
        break;
      case '05':
        month = 'Maig'
        break;
      case '06':
        month = 'Juny'
        break;
      case '07':
        month = 'Juliol'
        break;
      case '08':
        month = 'Agost'
        break;
      case '09':
        month = 'Setembre'
        break;
      case '10':
        month = 'Octubre'
        break;
      case '11':
        month = 'Novembre'
        break;
      case '12':
        month = 'Desembre'
        break;
    }

    return split[0] + ' ' + month + ', ' + split[2]

  }

  seeMoreSolucionsProposades() {
    this.currentSolucionsProposadesPage = this.currentSolucionsProposadesPage + 1;
    this.getSolucionsProposades(this.currentSolucionsProposadesPage, this.elements)
  }

  getSolucionsProposades(page, elements) {
    this.subscriptionHttp$ = this.httpCommunication.getSolucionsByRepte(this.idRepte, page, elements).pipe(first())
      .subscribe(data => {
        if (data.code == "1") {
          if (data.rows.length < 1) {
            this.solucionsProposadesNoMore = true;
          }

          for (let index = 0; index < data.rows.length; index++) {
            const solucioProposada = data.rows[index];

            this.solucionsProposades.push(solucioProposada)

            if (index < 5) {
              this.solucionsProposadesNoMore = true;
            } else {
              this.solucionsProposadesNoMore = false;
            }
          }

          this.getRepteGuanyadors();
        }
      })
  }

  deleteRepte() {
    let confirmWindow = confirm('Està segur que vol eliminar aquest repte?')

    if (confirmWindow == true) {
      if (this.idRepte && this.canDelete()) {

        this.httpCommunication.deleteRepte(this.idRepte).pipe(first())
          .subscribe(data => {
            if (data.code == 1) {
              if (this.currentUser) {
                this.toastr.success('Repte eliminat correctament', 'Eliminat');
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

  dIbiggerThanTodayDate(data_inici, comparator){
    let dateInici = new Date(data_inici);
    let currentDate = new Date();

    if(comparator == 'bigger'){
      if(dateInici > currentDate){
        return true;
      }
    }
    else{
      if(dateInici < currentDate || dateInici == currentDate){
        return true;
      }
    }

    return false;
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
        return "Tanca en " + days + " dies";
      }
      else {
        let days = Math.floor(dateFinal.getTime() / 1000 / 60 / 60 / 24);
        if (days > 30) {
          return "Finalitzat";
        }
        else {
          return "Finalitzat";
        }

      }
    }


  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  repteCanHaveForum(data_inici, data_final) {
    if (data_inici && data_final) {
      let dateInici = new Date(data_inici);
      let dateFinal = new Date(data_final);
      let currentDate = new Date();

      if (dateInici > currentDate) {
        return true;
      }
      else if (dateInici < currentDate && dateFinal > currentDate) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  getYoutubeUrl(url) {
    if (url) {
      let safeUrl: SafeUrl;

      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (match) {
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + match[2]);
        return safeUrl
      } else {
        return false
      }
    }
  }

  switchTextArea() {
    if (!this.textAreaOn) {
      this.textAreaOn = true;
      this.forumButtonText = '+ Publica'
      this.buttonDisabled = true;
    }
    else {
      this.subscriptionHttp6$ = this.httpCommunication.postTopic(this.idRepte, this.topicPost)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == 1) {
              this.topicPost = '';
              this.toastr.success('Missatge enviat correctament', 'Enviat');
              this.getRepteForum(this.idRepte, 1, 10);
            }
          }
        );
    }

  }

  onSearchChange(searchValue: string): void {
    if (searchValue == '') {
      this.buttonDisabled = true;
    }
    else {
      this.buttonDisabled = false;
    }
  }

  //Logica SOLUCIO GUANYADORA:

  showPillIndex(premiId, i, idSol, nomSol, descSol, solUserId, solUserImg, solNomEmp, solNomRockstar, solCogRockstar, solEmpRock){
    let obj = {
      premiId: premiId,
      idSolucio: idSol,
      nomSolucio: nomSol,
      descSolucio: descSol,
      solucioUserId: solUserId,
      solucioUserImg: solUserImg,
      solucioUserNomEmpresa: solNomEmp,
      solucioNomRockstar: solNomRockstar,
      solucioCognomRockstar: solCogRockstar,
      solEmpresaRockstar: solEmpRock
    }
    this.solucionsGuanyadoresObj[i] = obj;
    console.log(this.solucionsGuanyadoresObj[i])
  }

  crearPremisArray(){
    let obj = {
      premiId: '',
      idSolucio: '',
      nomSolucio: '',
      descSolucio: '',
      solucioUserId: '',
      solucioUserImg: '',
      solucioUserNomEmpresa: '',
      solucioNomRockstar: '',
      solucioCognomRockstar: '',
      solEmpresaRockstar: ''
    }
    this.repte.premis.forEach(element => {
      this.solucionsGuanyadoresObj[element.premi_nom] = obj;
    });
  }

  publicarGuanyadors(){
    let k;
    for (k of Object.keys(this.solucionsGuanyadoresObj)) {
      console.log("KEYVALUE:")
      var premiId = this.solucionsGuanyadoresObj[k].premiId
      var solId = this.solucionsGuanyadoresObj[k].idSolucio
      this.subscriptionHttp7$ = this.httpCommunication.setGuanyador(premiId, solId)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == 1) {
              this.toastr.success('Els guanyadors s\'han publicat correctament', 'Publicat')
              window.location.reload()
            }
          }
        );
  }
  }

  carregarRespostes(idMissatgePare, numRespostes) {

    //Falta fer el get sense auth en cas que sigui user sense login
    if (!this.objectRespostes["forumParent" + idMissatgePare]) {
      if (numRespostes > 0) {
        if (this.httpCommunication.loggedIn()) {
          this.subscriptionHttp3$ = this.httpCommunication.getForumRespostesLogin(idMissatgePare)
            .pipe(first())
            .subscribe(
              data => {
                if (data.code == '1') {
                  let variableName = "forumParent" + idMissatgePare;
                  this.objectRespostes[variableName] = data.rows;
                } else {
                  // console.log("Forum ERROR")
                }
              }
            );
        }
        else {
          this.subscriptionHttp3$ = this.httpCommunication.getForumRespostes(idMissatgePare)
            .pipe(first())
            .subscribe(
              data => {
                if (data.code == '1') {
                  let variableName = "forumParent" + idMissatgePare;
                  this.objectRespostes[variableName] = data.rows;
                } else {
                  // console.log("Forum ERROR")
                }
              }
            );
        }
      }
      else {
        // console.log("No té respostes my friend")
      }

    }
    else {
      // console.log("Already loaded!")
    }

  }

  likePost(user_like_count, idPost) {
    if (user_like_count == 0) {
      this.subscriptionHttp5$ = this.httpCommunication.likeTopic(idPost)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data);
            this.getRepteForum(this.idRepte, 1, 10);
          }
        );
    }
    else {
      this.subscriptionHttp5$ = this.httpCommunication.dislikeTopic(idPost)
        .pipe(first())
        .subscribe(
          data => {
            this.getRepteForum(this.idRepte, 1, 10);
          }
        );
    }
  }

  likePostChange(index, likeUser) {
    if (likeUser == 1) {
      this.forum[index].like_count = this.forum[index].like_count - 1
      this.forum[index].like_user_count = 0
    }
    else {
      this.forum[index].like_count = this.forum[index].like_count + 1
      this.forum[index].like_user_count = 1
    }
  }

  likeMessageChange(idMissatgePare, index, likeUser) {
    if (likeUser == 1) {
      this.objectRespostes["forumParent" + idMissatgePare][index].like_count = this.objectRespostes["forumParent" + idMissatgePare][index].like_count - 1
      this.objectRespostes["forumParent" + idMissatgePare][index].like_user_count = 0
    }
    else {
      this.objectRespostes["forumParent" + idMissatgePare][index].like_count = this.objectRespostes["forumParent" + idMissatgePare][index].like_count + 1
      this.objectRespostes["forumParent" + idMissatgePare][index].like_user_count = 1
    }
  }

  likeAnswerChange(idMissatgePare, index, childIndex, likeUser) {
    if (likeUser == 1) {
      this.objectRespostes["forumParent" + idMissatgePare][index].childs[childIndex].like_count = this.objectRespostes["forumParent" + idMissatgePare][index].childs[childIndex].like_count - 1
      this.objectRespostes["forumParent" + idMissatgePare][index].childs[childIndex].like_user_count = 0
    }
    else {
      this.objectRespostes["forumParent" + idMissatgePare][index].childs[childIndex].like_count = this.objectRespostes["forumParent" + idMissatgePare][index].childs[childIndex].like_count + 1
      this.objectRespostes["forumParent" + idMissatgePare][index].childs[childIndex].like_user_count = 1
    }
  }

  likeMessage(user_like_count, idMessage) {
    if (user_like_count == 0) {
      this.subscriptionHttp5$ = this.httpCommunication.likeMessage(idMessage)
        .pipe(first())
        .subscribe(
          data => {
            // console.log(data);
          }
        );
    }
    else {
      this.subscriptionHttp5$ = this.httpCommunication.dislikeMessage(idMessage)
        .pipe(first())
        .subscribe(
          data => {
            // console.log(data);
          }
        );
    }
  }

  contestar(idResposta) {
    //Posem tots els inputs en false again i nomes activem el que ha apretat nou l'user.
    for (const [key, value] of Object.entries(this.objectButtonsInput)) {
      if (value == true) {
        this.objectButtonsInput[key] = false
      }
    }
    this.objectButtonsInput[idResposta] = true;
  }

  returnTrue(idResposta) {
    if (this.objectButtonsInput[idResposta]) {
      return this.objectButtonsInput[idResposta]
    }
    else {
      return false;
    }
  }

  toggleGuanyadorPage(num){
    if(num == 2){
      var x = 0;
      this.repte.premis.forEach(element => {
        if(this.solucionsGuanyadoresObj[element.premi_nom].idSolucio == ''){
          x++
        }
      });
      x != 0 ? window.alert("Escull una solucio per cada premi!") : this.guanyadorPage = num;
    }
    else{
      this.guanyadorPage = num;
    }
  }

  sendMessage(message, topicId, messageParentId) {

    if (messageParentId != 0) {
      this.subscriptionHttp4$ = this.httpCommunication.sendHelp(message, topicId, messageParentId)
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == 1) {
              this.toastr.success('Missatge enviat correctament', 'Enviat')
            }
          }
        );
    }
    else {
      this.subscriptionHttp4$ = this.httpCommunication.sendHelp(message, topicId, '')
        .pipe(first())
        .subscribe(
          data => {
            if (data.code == 1) {
              this.toastr.success('Missatge enviat correctament', 'Enviat')
            }
          }
        );
    }


  }
}
