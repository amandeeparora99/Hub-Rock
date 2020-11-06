import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { SpinnerService } from './spinner/spinner.service';

@Injectable()
export class HttperrorinterceptorInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          this.spinnerService.requestEnded();

          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error de client: ${error.error.message} Refresca la pàgina o torna a provar-ho més tard`;
          } else {
            // server-side error
            errorMessage = `Error del servidor Code: ${error.status}\nMessage: ${error.message} Refresca la pàgina o torna a provar-ho més tard`;
          }
          window.alert(errorMessage);
          return throwError(errorMessage);
        })
      )

  }
}
