import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { TwitchClipDto } from '@twitch-audio-copyright/data';
import { Observable } from 'rxjs';

@Injectable()
export class ClipResolver implements Resolve<TwitchClipDto[]> {

  constructor(private dashboardService: DashboardService) {
  }

  resolve(): Observable<TwitchClipDto[]> {
    return this.dashboardService.getTwitchClips();
  }
}

