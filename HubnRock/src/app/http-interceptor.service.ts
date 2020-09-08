import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _httpService: HttpCommunicationService) { }

  intercept(req, next) {
    var currentUser = JSON.parse(this._httpService.getCurrentUser());
    if (currentUser && currentUser.token) {
      var reqWithToken = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
      return next.handle(reqWithToken)
    } else {
      return next.handle(req)
    }
  }
}
