import { Injectable } from '@angular/core';
import { ReusableModule } from '../reusable.module';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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

  login(email: string, password: string) {
    console.log(email + " " + password);
    return this.http.post<any>(environment.api + '/login', { email, password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data.code == "302") {
          if (data && data.token) {
            console.log("error servei")
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify({ "token": data.token, "idUser": data.user.iduser, "email": data.user.email }));
            this.currentUserSubject.next(data);
          }
        }
        return data;
      }));
  }

  registerEmpresa(email, password, empresa_rockstar, nom_empresa, nom_responsable, nif_empresa, ubicacio, bio): Observable<any> {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('empresa_rockstar', empresa_rockstar)
      .set('nom_empresa', nom_empresa)
      .set('nom_responsable', nom_responsable)
      .set('nif_empresa', nif_empresa)
      .set('ubicacio', ubicacio)
      .set('bio', bio);

    return this.http.post(environment.api + '/user/register',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

  registerRockstar(email, password, empresa_rockstar, nom_rockstar, ocupacio, ubicacio, bio, experiencia, educacio): Observable<any> {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('empresa_rockstar', empresa_rockstar)
      .set('nom_rockstar', nom_rockstar)
      .set('ocupacio', ocupacio)
      .set('ubicacio', ubicacio)
      .set('bio', bio)
      .set('experiencia', experiencia)
      .set('educacio', educacio);

    return this.http.post(environment.api + '/user/register',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }

}
