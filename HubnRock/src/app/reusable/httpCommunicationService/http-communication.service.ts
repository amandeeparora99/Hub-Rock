import { Injectable } from '@angular/core';
import { ReusableModule } from '../reusable.module';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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

  login(email: string, password: string) {
    console.log(email + " " + password);
    return this.http.post<any>(environment.api + '/login', { email, password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data.code == "302") {
          if (data && data.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify({ "token": data.token, "idUser": data.user.iduser, "email": data.user.email }));
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

    return this.http.post(environment.api + '/user/shortRegisterEmpresa',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );

  }

  registerRockstar(email, password, nom_rockstar): Observable<any> {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password)
      .set('nom_rockstar', nom_rockstar)

    return this.http.post(environment.api + '/user/shortRegisterRockstar',
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
        if (data.code == "103") {
          console.log('is null')
        } else if (data.code == "104") {
          console.log('is short')
        } else if (data.code == "105") {
          console.log('is long')
        } else if (data.code == "106") {
          console.log('is not num')
        } else if (data.code == "107") {
          console.log('is not dni/nie/cif')
        } else if (data.code == "108") {
          console.log('is not email')
        } else if (data.code == "109") {
          console.log('is not date')
        } else if (data.code == "110") {
          console.log('is not boolean')
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
    for (var value of form.values()) {
      console.log(value);
    }
    return this.http.post<any>(environment.api + '/repte/addRevisio', form)
      .pipe(map(data => {

        return data;
      }));

  }


  getAllValidReptes(page, elements): Observable<any> {
    console.log("entrat a get all valid reptes")
    //console.log(email + " " + password);
    return this.http.get<any>(environment.api + `/repte/getAllDetailedPageValid/${page}/${elements}`)
      .pipe(map(data => {
        if (data.code == "103") {
          console.log('is null')
        } else if (data.code == "104") {
          console.log('is short')
        } else if (data.code == "105") {
          console.log('is long')
        } else if (data.code == "106") {
          console.log('is not num')
        } else if (data.code == "107") {
          console.log('is not dni/nie/cif')
        } else if (data.code == "108") {
          console.log('is not email')
        } else if (data.code == "109") {
          console.log('is not date')
        } else if (data.code == "110") {
          console.log('is not boolean')
        }

        return data;

      }));
  }
}
