import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable()
export class VideoResolver implements Resolve<any> {

  constructor(/*private dashboardService: DashboardService*/) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    console.log('video resolved');
    // return this.componentService.getComponents(route.paramMap.get('tag')).pipe(take(1));
  }

}
