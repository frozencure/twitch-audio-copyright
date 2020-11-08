import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  public isLoggedIn(): Observable<boolean> {
    return this.http.get<boolean>('api/auth/sync').pipe(first());
  }

  public logout(): void {
    this.router.navigate([ 'login' ]);
  }
}
