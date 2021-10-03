import { Injectable } from '@angular/core';
import { ReusableModule } from '../reusable.module';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Form } from '@angular/forms';
import { User } from '../../user';
import { stringify } from '@angular/compiler/src/util';
import { STRING_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})


export class HttpCommunicationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  saveCurrentUserLocalStorage(token, idUser, email) {
    // console.log('es crida save current', idUser, token, email)
    this.getUser(idUser).pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            // console.log('retorna luser correctament')

            localStorage.setItem('currentUser', JSON.stringify({ "token": token, "idUser": idUser, "email": email, "userType": data.row.empresa_rockstar, "userRole": data.row.role_idrole }));
            let nomE;
            if (data.row.empresa_rockstar == 0) {
              nomE = data.row.nom_empresa
            }
            else {
              nomE = data.row.nom_rockstar
            }
            // console.log("ESTA FENT CANVIS")
            this.currentUserSubject.next({

              token: token,
              idUser: idUser,
              nom: nomE,
              cognom: data.row.cognom_rockstar,
              email: email,
              userType: data.row.empresa_rockstar,
              firstLogin: data.row.first_login,
              userRole: data.row.role_idrole
            });
          }
        },
        error => {
          console.log("Fail")
        });


  }

  login(email: string, password: string) {
    // console.log(email + " " + password);
    return this.http.post<any>(environment.api + '/login', { email, password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data.code == "302") {
          if (data && data.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.saveCurrentUserLocalStorage(data.token, data.user.iduser, data.user.email);

          }
        }
        return data;
      }));
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('currentUser');
  }

  loggedIn() {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUser() {
    return localStorage.getItem('currentUser');
  }

  emailExists(email): Observable<any> {
    return this.http.get<any>(environment.api + '/usersData/existsEmail/' + email)
      .pipe(map(data => {

        return data;

      }));
  }

  registerEmpresa(email, password, nom_empresa, nom_responsable, nif_empresa, checkedIDs, tipusSelected, latUser, lngUser, addrUser): Observable<any> {
    // console.log('Register', latUser, lngUser)
    let objecteDireccio = { 'lat': latUser, 'lng': lngUser, 'addr': addrUser }

    let body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('nom_empresa', nom_empresa)
      .set('nom_responsable', nom_responsable)
      .set('nif_empresa', nif_empresa)

    for (let index = 0; index < checkedIDs.length; index++) {
      body = body.append(`industria[${index}]`, checkedIDs[index]);
    }

    body = body.append('tipus_perfil', tipusSelected)
    // console.log(objecteDireccio)
    body = body.append('ciutat_residencia', JSON.stringify(objecteDireccio))

    // console.log('BOOOODY  ', body)

    return this.http.post<any>(environment.api + '/user/shortRegisterEmpresa',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        // console.log("DATA DEL QUE RETORNA EL SHORTREGISTER")
        // console.log(data)

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // this.saveCurrentUserLocalStorage(data.token, data.lastId, email)


        return data;
      }
    }));

  }

  registerRockstar(email, password, nom_rockstar, cognom_rockstar, checkedIDs, tipusSelected, latUser, lngUser, addrUser): Observable<any> {
    let objecteDireccio = { 'lat': latUser, 'lng': lngUser, 'addr': addrUser }

    let body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('nom_rockstar', nom_rockstar)
      .set('cognom_rockstar', cognom_rockstar)
    for (let index = 0; index < checkedIDs.length; index++) {
      body = body.append(`industria[${index}]`, checkedIDs[index]);
    }

    body = body.append('tipus_perfil', tipusSelected)
    // console.log(objecteDireccio)
    body = body.append('ciutat_residencia', JSON.stringify(objecteDireccio))

    // console.log('BOOOODY  ', body)
    return this.http.post<any>(environment.api + '/user/shortRegisterRockstar',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        // console.log("DATA DEL QUE RETORNA EL SHORTREGISTER")
        console.log(data)

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // this.saveCurrentUserLocalStorage(data.token, data.lastId, email)


        return data;
      }
    }));
  }

  // Recover password, validate register:

  validateAccount(encrypt_string): Observable<any> {
    return this.http.get<any>(environment.api + `/activate/${encrypt_string}`)
      .pipe(map(data => {
        return data;
      }));
  }

  sendRecoverLink(email): Observable<any> {
    const body = new HttpParams()
      .set('email', email)

    return this.http.post<any>(environment.api + '/forgetPassword/sendEmail',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  recoverPassword(encrypt_string, password): Observable<any> {
    const body = new HttpParams()
      .set('password', password)

    return this.http.post<any>(environment.api + `/forgetPassword/sendPassword/${encrypt_string}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }


  getRepte(repte_id): Observable<any> {
    return this.http.get<any>(environment.api + '/repte/get/' + repte_id)
      .pipe(map(data => {

        return data;

      }));
  }

  changeSolucioState(solucioId, stateId): Observable<any> {
    return this.http.get<any>(environment.api + '/solucio/editStateSolucio/' + solucioId + '/' + stateId)
      .pipe(map(data => {
        return data;
      }));
  }

  getUser(user_id): Observable<any> {

    return this.http.get<any>(environment.api + '/user/get/' + user_id)
      .pipe(map(data => {
        if (data.code == "2") {
          console.log('User does not exist')
        }

        return data;

      }));
  }


  //FÒRUM ------------------------------

  getForum(repte_id, page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/topics/${repte_id}/${page}/${elements}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getForumLogin(repte_id, page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/topicsAuth/${repte_id}/${page}/${elements}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getForumRespostes(topicId): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/messages/${topicId}`)
      .pipe(map(data => {
        return data;
      }));
  }

  getForumRespostesLogin(topicId): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/messagesAuth/${topicId}`)
      .pipe(map(data => {
        return data;
      }));
  }

  likeTopic(topicId): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/likeTopic/${topicId}`)
      .pipe(map(data => {
        return data;
      }));
  }

  dislikeTopic(topicId): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/dislikeTopic/${topicId}`)
      .pipe(map(data => {
        return data;
      }));
  }

  likeMessage(messageId): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/likeMessage/${messageId}`)
      .pipe(map(data => {
        return data;
      }));
  }

  dislikeMessage(messageId): Observable<any> {
    return this.http.get<any>(environment.api + `/forumData/dislikeMessage/${messageId}`)
      .pipe(map(data => {
        return data;
      }));
  }

  postTopic(repteId, message): Observable<any> {
    const body = new HttpParams()
      .set('message', message)

    return this.http.post<any>(environment.api + `/forumData/topic/${repteId}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        let localStorageUser = JSON.parse(localStorage.getItem('currentUser'))
        this.saveCurrentUserLocalStorage(localStorageUser.token, localStorageUser.idUser, localStorageUser.email);
        // console.log(data)
        return data;
      }
    }));
  }


  // ---------------------

  editShortUser(form): Observable<any> {
    return this.http.post<any>(environment.api + '/user/shortEdit', form)
      .pipe(map(data => {
        let localStorageUser = JSON.parse(localStorage.getItem('currentUser'))
        this.saveCurrentUserLocalStorage(localStorageUser.token, localStorageUser.idUser, localStorageUser.email);

        return data;
      }));
  }

  uploadImageShortEdit(form): Observable<any> {
    return this.http.post<any>(environment.api + '/user/addUserPhoto', form)
      .pipe(map(data => {

        return data;
      }));
  }

  editPersonalProfile(form): Observable<any> {
    return this.http.post<any>(environment.api + `/user/editProfile`, form)
      .pipe(map(data => {
        let localStorageUser = JSON.parse(localStorage.getItem('currentUser'))
        this.saveCurrentUserLocalStorage(localStorageUser.token, localStorageUser.idUser, localStorageUser.email);

        return data;
      }));
  }

  changeFirstLogin(first_login): Observable<any> {
    const body = new HttpParams()
      .set('first_login', first_login)

    return this.http.post<any>(environment.api + '/user/changeFirstLogin',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        let localStorageUser = JSON.parse(localStorage.getItem('currentUser'))
        this.saveCurrentUserLocalStorage(localStorageUser.token, localStorageUser.idUser, localStorageUser.email);
        // console.log(data)
        return data;
      }
    }));
  }

  // FORUM ==================================

  sendForumTopic(repteId, form): Observable<any> {
    return this.http.post<any>(environment.api + `/forumData/topic/${repteId}`, form)
      .pipe(map(data => {
        return data;
      }));
  }

  sendForumMessage(form): Observable<any> {
    return this.http.post<any>(environment.api + '/forumData/message', form)
      .pipe(map(data => {
        return data;
      }));
  }

  sendHelp(message, topicId, messageParentId): Observable<any> {
    if (messageParentId == '') {
      var body = new HttpParams()
        .set('message', message)
        .set('topicId', topicId)
    }
    else {
      var body = new HttpParams()
        .set('message', message)
        .set('topicId', topicId)
        .set('messageParentId', messageParentId)
    }
    return this.http.post<any>(environment.api + '/forumData/message',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        // console.log(data)
        return data;
      }
    }));
  }

  //==========================================


  addRepteBorrador(form: FormData): Observable<any> {
    //   for (var value of form.values()) {
    //     console.log(value); 
    //  }
    return this.http.post<any>(environment.api + '/repte/addBorrador', form)
      .pipe(map(data => {

        return data;
      }));

  }

  addRepteRevisio(form): Observable<any> {
    // for (var value of form.values()) {
    //   console.log(value);
    // }
    console.log("HttpCom entered...")
    return this.http.post<any>(environment.api + '/repte/addRevisio', form)
      .pipe(map(data => {
        console.log(data)
        return data;
      }));

  }


  getAllValidReptes(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/repte/getAllDetailedPageValid/${page}/${elements}`)
      .pipe(map(data => {

        return data;

      }));
  }

  getReptesOberts(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/repte/getAllObertsPage/${page}/${elements}`)
      .pipe(map(data => {

        return data;

      }));
  }

  getReptesObertsAdmin(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/repte/getAllObertsPageAdmin/${page}/${elements}`)
      .pipe(map(data => {

        return data;

      }));
  }

  getReptesProces(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/repte/getAllEnProcesPage/${page}/${elements}`)
      .pipe(map(data => {

        return data;

      }));
  }

  getReptesProcesAdmin(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/repte/getAllEnProcesPageAdmin/${page}/${elements}`)
      .pipe(map(data => {

        return data;

      }));
  }

  getReptesTancats(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/repte/getAllTancatsPage/${page}/${elements}`)
      .pipe(map(data => {

        return data;

      }));
  }

  getReptesTancatsAdmin(page, elements): Observable<any> {
    //console.log(email + " " + password);
    return this.http.get<any>(environment.api + `/repte/getAllTancatsPageAdmin/${page}/${elements}`)
      .pipe(map(data => {

        return data;

      }));
  }

  getReptesSearch(string, page, elements): Observable<any> {
    // console.log("entrat a get reptes Buscats")
    //console.log(email + " " + password);
    return this.http.get<any>(environment.api + `/repte/getByName/${string}/${page}/${elements}`)
      .pipe(map(data => {


        return data;

      }));
  }

  getReptesSearchByName(cerca, empreses, startups, estudiants, experts, page, elements): Observable<any> {
    if (empreses || startups || estudiants || experts) {
      var body = new HttpParams()
        .set(empreses ? 'tipus_empresa[0]' : '', empreses ? '1' : '0')
        .set(startups ? 'tipus_empresa[1]' : '', startups ? '2' : '0')
        .set(estudiants ? 'tipus_empresa[2]' : '', estudiants ? '3' : '0')
        .set(experts ? 'tipus_empresa[3]' : '', experts ? '4' : '0')

      return this.http.post<any>(environment.api + `/repte/getByNameByTipusEmpresa/${cerca}/${page}/${elements}`,
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      ).pipe(map(data => {
        if (data.code == '1') {
          return data;
        }
      }));
    }
    else {
      return this.http.post<any>(environment.api + `/repte/getByNameByTipusEmpresa/${cerca}/${page}/${elements}`,
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      ).pipe(map(data => {
        if (data.code == '1') {
          return data;
        }
      }));
    }

  }

  getReptesSearchByNameAdmin(cerca, empreses, startups, estudiants, experts, page, elements): Observable<any> {
    if (empreses || startups || estudiants || experts) {
      var body = new HttpParams()
        .set(empreses ? 'tipus_empresa[0]' : '', empreses ? '1' : '0')
        .set(startups ? 'tipus_empresa[1]' : '', startups ? '2' : '0')
        .set(estudiants ? 'tipus_empresa[2]' : '', estudiants ? '3' : '0')
        .set(experts ? 'tipus_empresa[3]' : '', experts ? '4' : '0')

      return this.http.post<any>(environment.api + `/repte/getByNameByTipusEmpresaAdmin/${cerca}/${page}/${elements}`,
        body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      ).pipe(map(data => {
        if (data.code == '1') {
          return data;
        }
      }));
    }
    else {
      return this.http.post<any>(environment.api + `/repte/getByNameByTipusEmpresaAdmin/${cerca}/${page}/${elements}`,
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }
      ).pipe(map(data => {
        if (data.code == '1') {
          return data;
        }
      }));
    }

  }

  getReptesSearchByTipus(empreses, startups, estudiants, experts, page, elements): Observable<any> {

    var body = new HttpParams()
      .set(empreses ? 'tipus_empresa[0]' : '', empreses ? '1' : '0')
      .set(startups ? 'tipus_empresa[1]' : '', startups ? '2' : '0')
      .set(estudiants ? 'tipus_empresa[2]' : '', estudiants ? '3' : '0')
      .set(experts ? 'tipus_empresa[3]' : '', experts ? '4' : '0')

    return this.http.post<any>(environment.api + `/repte/getByTipusEmpresa/${page}/${elements}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        return data;
      }
    }));


  }

  getReptesSearchByTipusAdmin(empreses, startups, estudiants, experts, page, elements): Observable<any> {

    var body = new HttpParams()
      .set(empreses ? 'tipus_empresa[0]' : '', empreses ? '1' : '0')
      .set(startups ? 'tipus_empresa[1]' : '', startups ? '2' : '0')
      .set(estudiants ? 'tipus_empresa[2]' : '', estudiants ? '3' : '0')
      .set(experts ? 'tipus_empresa[3]' : '', experts ? '4' : '0')

    return this.http.post<any>(environment.api + `/repte/getByTipusEmpresaAdmin/${page}/${elements}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        return data;
      }
    }));


  }

  getReptesByUser(page, elements) {
    return this.http.get<any>(environment.api + `/repte/getAllDetailedPaginationByUser/${page}/${elements}`)
      .pipe(map(data => {

        return data;
      }));
  }

  getReptesEsborranyByUser(page, elements) {
    return this.http.get<any>(environment.api + `/repte/getAllDetailedEsborranysPaginationByUser/${page}/${elements}`)
      .pipe(map(data => {

        return data;
      }));
  }

  getReptesByUserId(userId, page, elements) {
    return this.http.get<any>(environment.api + `/repte/getAllDetailedPaginationByIdUser/${userId}/${page}/${elements}`)
      .pipe(map(data => {

        return data;
      }));
  }

  addSolucioBorrador(form, idRepte): Observable<any> {
    
    return this.http.post<any>(environment.api + '/solucio/addBorrador/' + idRepte, form)
      .pipe(map(data => {
        
        console.log(data)
        return data;
      }));
  }

  addSolucioValid(form, idRepte): Observable<any> {

    return this.http.post<any>(environment.api + '/solucio/addValidat/' + idRepte, form)
      .pipe(map(data => {

        return data;
      }));
  }

  getSolucio(idSolucio): Observable<any> {
    return this.http.get<any>(environment.api + '/solucio/get/' + idSolucio)
      .pipe(map(data => {

        return data;
      }));
  }

  getSolucionsByRepte(idRepte, page, elements): Observable<any> {
    // console.log(idRepte, page, elements)
    return this.http.get<any>(environment.api + `/solucio/getAllDetailedPaginationByRepte/${idRepte}/${page}/${elements}`)
      .pipe(map(data => {

        return data;
      }));
  }

  getSolucionsByUser(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/solucio/getAllDetailedPaginationByUser/${page}/${elements}`)
      .pipe(map(data => {

        return data;
      }));
  }

  getSolucionsEsborranyByUser(page, elements): Observable<any> {
    return this.http.get<any>(environment.api + `/solucio/getAllDetailedEsborranysPaginationByUser/${page}/${elements}`)
      .pipe(map(data => {

        return data;
      }));
  }

  getSolucionsByUserId(userId, page, elements) {
    return this.http.get<any>(environment.api + `/solucio/getAllDetailedPaginationByIdUser/${userId}/${page}/${elements}`)
      .pipe(map(data => {

        return data;
      }));
  }

  getSolucionsAdmin(page) {
    return this.http.get<any>(environment.api + `/solucio/getAllDetailedPage/${page}/3`)
      .pipe(map(data => {

        return data;
      }));
  }

  changeStateRepte(idRepte, estat) {
    return this.http.get<any>(environment.api + `/repte/editStateRepte/${idRepte}/${estat}`)
      .pipe(map(data => {

        return data;
      }));
  }

  deleteRepte(idRepte) {
    return this.http.get<any>(environment.api + `/repte/eliminarRepteUser/${idRepte}`)
      .pipe(map(data => {

        return data;
      }));
  }

  deleteSolucio(idSolucio) {
    return this.http.get<any>(environment.api + `/solucio/eliminarSolucioUser/${idSolucio}`)
      .pipe(map(data => {

        return data;
      }));
  }

  editSolucioEsborrany(idSolucio, form): Observable<any> {
    return this.http.post<any>(environment.api + `/solucio/editBorrador/${idSolucio}`, form)
      .pipe(map(data => {

        return data;
      }));
  }

  editSolucio(idSolucio, form): Observable<any> {
    return this.http.post<any>(environment.api + `/solucio/editRevisio/${idSolucio}`, form)
      .pipe(map(data => {

        return data;
      }));
  }

  editRepteEsborrany(idRepte, form): Observable<any> {

    return this.http.post<any>(environment.api + `/repte/editBorrador/${idRepte}`, form)
      .pipe(map(data => {

        return data;
      }));
  }

  editRepte(idRepte, form): Observable<any> {

    return this.http.post<any>(environment.api + `/repte/editRevisio/${idRepte}`, form)
      .pipe(map(data => {

        return data;
      }));
  }
  // changeUserDetails(form): Observable<any> {
  //   return this.http.post<any>(environment.api + '/solucio/addValidat/' + form)
  //   .pipe(map(data => {

  //     return data;
  //   }));
  // }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(environment.api + `/user/getAll`)
      .pipe(map(data => {
        return data;
      }));
  }

  getUsersSearch(cerca, empresesChecked, startupsChecked, industriesArray, page, elements): Observable<any> {
    let body = new HttpParams()

    if (empresesChecked) {
      body = body.append(`tipus[0]`, 'empresa');
    }
    if (startupsChecked) {
      body = body.append(`tipus[1]`, 'startup');
    }

    for (let index = 0; index < industriesArray.length; index++) {
      body = body.append(`industria[${index}]`, industriesArray[index]);
    }

    return this.http.post<any>(environment.api + `/user/getAll/${cerca}/${page}/${elements}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // this.saveCurrentUserLocalStorage(data.token, data.lastId, email)


        return data;
      }
    }));

  }

  getUsersSearchEmpty(empresesChecked, startupsChecked, industriesArray, page, elements): Observable<any> {
    let body = new HttpParams()

    if (empresesChecked) {
      body = body.append(`tipus[0]`, 'empresa');
    }
    if (startupsChecked) {
      body = body.append(`tipus[1]`, 'startup');
    }

    for (let index = 0; index < industriesArray.length; index++) {
      body = body.append(`industria[${index}]`, industriesArray[index]);
    }

    return this.http.post<any>(environment.api + `/user/getAll/${page}/${elements}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        // this.saveCurrentUserLocalStorage(data.token, data.lastId, email)
        return data;
      }
    }));

  }

  getReptesByNameSearch(searchKeyword, page, elements): Observable<any> {
    var body = new HttpParams()

    return this.http.post<any>(environment.api + `/repte/getByNameAndParams/${searchKeyword}/${page}/${elements}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        return data;
      }
    }));

  }

  getReptesByNameAndParamsSearch(searchKeyword, status, empresesChecked, startupsChecked, expertsChecked, estudiantsChecked, page, elements): Observable<any> {
    let body = new HttpParams()

    if (status) {
      body = body.append(`estat[0]`, status);
    }
    if (empresesChecked) {
      body = body.append(`tipus[0]`, '1');
    }
    if (startupsChecked) {
      body = body.append(`tipus[1]`, '2');
    }
    if (expertsChecked) {
      body = body.append(`tipus[2]`, '3');
    }
    if (estudiantsChecked) {
      body = body.append(`tipus[3]`, '4');
    }

    return this.http.post<any>(environment.api + `/repte/getByNameAndParams/${searchKeyword}/${page}/${elements}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        return data;
      }
    }));

  }

  getUsersSearchBar(cerca, empresesChecked, startupsChecked, expertsChecked, estudiantsChecked, industriesArray, page, elements): Observable<any> {
    let body = new HttpParams()

    if (empresesChecked) {
      body = body.append(`tipus[0]`, 'empresa');
    }
    if (startupsChecked) {
      body = body.append(`tipus[1]`, 'startup');
    }
    if (expertsChecked) {
      body = body.append(`tipus[2]`, 'estudiant');
    }
    if (estudiantsChecked) {
      body = body.append(`tipus[3]`, 'expert');
    }

    for (let index = 0; index < industriesArray.length; index++) {
      body = body.append(`industria[${index}]`, industriesArray[index]);
    }

    return this.http.post<any>(environment.api + `/user/getAll/${cerca}/${page}/${elements}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        return data;
      }
    }));

  }


  crudGetAll(): Observable<any>{
    return this.http.get<any>(environment.api + `/repte/getAll/`)
      .pipe(map(data => {
        return data;
      }));
    
  }

  blockUser(userId): Observable<any>{
    return this.http.get<any>(environment.api + `/user/blockUser/${userId}`)
      .pipe(map(data => {
        return data;
      }));
    
  }

  getAllUserChats(): Observable<any> {
    return this.http.get<any>(environment.api + `/getUserFullChats`)
      .pipe(map(data => {
        return data;
      }));
  }

  getAllDialog(chatId): Observable<any> {
    return this.http.get<any>(environment.api + `/getChatById/${chatId}`)
      .pipe(map(data => {
        return data;
      }));
  }

  postDialogMsg(idChat, message): Observable<any> {
    // console.log("CONSOLE LOG ABANS D'ENVIAR: idchat - " + idChat + ", message: " + message)
    const body = new HttpParams()
      .set('idchat', idChat)
      .set('message', message)

    return this.http.post<any>(environment.api + `/updateChat`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        return data;
      }
    }));
  }

  createNewChat(userName, contactName, contactId): Observable<any> {
    const body = new HttpParams()
      .set('user_name', userName)
      .set('contact_name', contactName)
      .set('contact_id', contactId)

    return this.http.post<any>(environment.api + `/createNewChat`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        return data;
      }
    }));
  }

  resetUnread(chatId, contactId): Observable<any> {
    const body = new HttpParams()
      .set('chat_id', chatId)
      .set('contact_id', contactId)

    return this.http.post<any>(environment.api + `/resetUnread`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
        return data;
    }));
  }

  sendContactEmail(form): Observable<any> {
    const headers = { 'Content-Type': 'application/json'}
    return this.http.post<any>(environment.localApi + `/enviarContact`, form,  { headers })
      .pipe(map(data => {
        return data;
      }));
  }

  subNewsletter(form): Observable<any> {
    const headers = { 'Content-Type': 'application/json'}
    return this.http.post<any>(environment.localApi + `/newsletter`, form,  { headers })
      .pipe(map(data => {
        return data;
      }));
  }

  //======== Guanyadors repte

  setGuanyador(premiId, solucioId): Observable<any> {
    const body = new HttpParams()
      .set('solucio_id', solucioId)

    return this.http.post<any>(environment.api + `/repte/setGuanyador/${premiId}`,
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
        return data;
    }));
  }
}
