import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate() {
    return new Observable<boolean>(subscriber => {
      this.auth.isLoggedIn().subscribe(_ => subscriber.next(true),
        err => subscriber.next(false));
    });
  }

}
