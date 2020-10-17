import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpCommunicationService } from './reusable/httpCommunicationService/http-communication.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _httpService: HttpCommunicationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("SPINNER INICIAT")
    return this.handler(next, req);
  }

  handler(next, request){
    return next.handle(request)
      .pipe(
        tap(
          (event) => {
            if (event instanceof HttpResponse) {
              console.log("SPINNER PARAT")
              var currentUser = JSON.parse(this._httpService.getCurrentUser());
              if (currentUser && currentUser.token) {
                var reqWithToken = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                  }
                })
                return next.handle(reqWithToken)
              } else {
                return next.handle(request)
              }
            }
          },
          (error: HttpErrorResponse) => {
            console.log("SPINNER RESETEJAT")
            throw error;
          }
        ),
    );
  }


}
