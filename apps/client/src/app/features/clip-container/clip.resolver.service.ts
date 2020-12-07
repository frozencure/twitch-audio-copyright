import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { TwitchClipDto } from '../../../../../../libs/data/src';
import { Observable } from 'rxjs';

@Injectable()
export class ClipResolver implements Resolve<TwitchClipDto[]> {

  constructor(private dashboardService: DashboardService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TwitchClipDto[]> {
    return this.dashboardService.getTwitchClips();
  }
}

