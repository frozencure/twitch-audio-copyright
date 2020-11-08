import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SuccessDto } from '@twitch-audio-copyright/data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  public isLoggedIn(): Observable<boolean> {
    return this.http.get<SuccessDto>('api/auth/sync').pipe(first());
  }

  public redirectToLogin() {
    this.router.navigate([ 'login' ]);
  }

  public logout(): Observable<any> {
    return this.http.get<SuccessDto>('api/auth/logout').pipe(first(), map(_ => this.redirectToLogin()));
  }
}
