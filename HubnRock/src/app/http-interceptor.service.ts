import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { map } from 'rxjs/operators';
import { SpinnerService } from './spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _httpService: HttpCommunicationService, private spinnerService: SpinnerService) { }

  intercept(req, next) {
    // this.spinnerService.requestStarted();

    var currentUser = JSON.parse(this._httpService.getCurrentUser());
    if (currentUser && currentUser.token) {
      var reqWithToken = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      })
      return next.handle(reqWithToken).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            
            console.log('event--->>>', event);
            // this.spinnerService.requestEnded();

          }
          return event;
        })); 

    } else {
      return next.handle(req)
    }
  }
}