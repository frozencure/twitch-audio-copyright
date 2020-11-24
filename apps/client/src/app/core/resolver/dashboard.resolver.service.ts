import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { AuthState, AuthStateModel } from '../../store/auth.state';

@Injectable()
export class DashboardResolver implements Resolve<any> {

  @Emitter(AuthState.setAuthenticated) setAuthenticated: Emittable<AuthStateModel>;

  constructor(private cookie: CookieService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.setAuthenticated.emit({
      token: this.cookie.get('token'),
      user: JSON.parse(this.cookie.get('user'))
    });
  }

}
