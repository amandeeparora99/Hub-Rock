import { Injectable } from '@angular/core';
import { ReusableModule } from '../reusable.module';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Form } from '@angular/forms';

interface User {
  email: String,
  password: String
}

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



    this.getUser(idUser).pipe(first())
      .subscribe(
        data => {
          if (data.code == '1') {
            localStorage.setItem('currentUser', JSON.stringify({ "token": token, "idUser": idUser, "email": email, "userType": data.row.empresa_rockstar }));
          }
        },
        error => {
          console.log("Fail")
        });


  }

  login(email: string, password: string) {
    console.log(email + " " + password);
    return this.http.post<any>(environment.api + '/login', { email, password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data.code == "302") {
          if (data && data.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.saveCurrentUserLocalStorage(data.token, data.user.iduser, data.user.email);
            this.currentUserSubject.next(data);

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

  loggedIn() {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUser() {
    return localStorage.getItem('currentUser');
  }


  registerEmpresa(email, password, nom_empresa, nom_responsable, nif_empresa): Observable<any> {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('nom_empresa', nom_empresa)
      .set('nom_responsable', nom_responsable)
      .set('nif_empresa', nif_empresa)

    return this.http.post<any>(environment.api + '/user/shortRegisterEmpresa',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        console.log(data)

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.saveCurrentUserLocalStorage(data.token, data.lastId, email)
        this.currentUserSubject.next(data);


        return data;
      }
    }));

  }

  registerRockstar(email, password, nom_rockstar): Observable<any> {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('nom_rockstar', nom_rockstar)

    return this.http.post<any>(environment.api + '/user/shortRegisterRockstar',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    ).pipe(map(data => {
      if (data.code == '1') {
        console.log(data)

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.saveCurrentUserLocalStorage(data.token, data.lastId, email)
        this.currentUserSubject.next(data);


        return data;
      }
    }));
  }

  getRepte(repte_id): Observable<any> {
    return this.http.get<any>(environment.api + '/repte/get/' + repte_id)
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
    return this.http.post<any>(environment.api + '/repte/addRevisio', form)
      .pipe(map(data => {

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
    console.log("entrat a get reptes Buscats")
    //console.log(email + " " + password);
    return this.http.get<any>(environment.api + `/repte/getByName/${string}/${page}/${elements}`)
      .pipe(map(data => {


        return data;

      }));
  }

  getReptesByUser() {
    return this.http.get<any>(environment.api + '/repte/getAllDetailedByUser/')
      .pipe(map(data => {

        return data;
      }));
  }

  getReptesByUserId(userId) {
    return this.http.get<any>(environment.api + '/repte/getAllDetailedByIdUser/' + userId)
      .pipe(map(data => {

        return data;
      }));
  }

  addSolucioBorrador(form, idRepte): Observable<any> {

    return this.http.post<any>(environment.api + '/solucio/addBorrador/' + idRepte, form)
      .pipe(map(data => {

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

  getSolucionsByUser() {
    return this.http.get<any>(environment.api + '/solucio/getAllDetailedByUser')
      .pipe(map(data => {

        return data;
      }));
  }

  getSolucionsByUserId(userId) {
    return this.http.get<any>(environment.api + '/solucio/getAllByUser/' + userId)
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
}
