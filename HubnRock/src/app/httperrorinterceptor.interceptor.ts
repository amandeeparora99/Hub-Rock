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
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttperrorinterceptorInterceptor implements HttpInterceptor {

  constructor(public toastr: ToastrService, private spinnerService: SpinnerService) { }

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
            errorMessage = 'Error del servidor, Codi: ' + error.status + ' </br> Missatge: ' + error.message + ' </br> Refresca la pàgina o torna a provar-ho més tard';
          }
          this.toastr.error(errorMessage, 'Error', {
            timeOut: 10000,
            enableHtml: true
          });

          return throwError(errorMessage);
        })
      )

  }
}
