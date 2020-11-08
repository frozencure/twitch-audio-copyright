import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthService } from './login/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((err: HttpErrorResponse) => {
        if (err) {
          return this.handleError(err);
        }
        return throwError(err);
      }));
  }

  private handleError(err: HttpErrorResponse) {
    switch (err.status) {
      case (401):
        this.auth.logout();
        return throwError('CANCEL');
      case (406):
        return throwError(err.error.statusCode + err.error.message);
      default:
        return throwError(err);
    }
  }
}
