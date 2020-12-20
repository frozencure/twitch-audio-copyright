import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { forkJoin, from, Observable } from 'rxjs';
import { HelixVideo } from 'twitch';
import { TwitchService } from '../../core/services/twitch.service';
import { map } from 'rxjs/operators';

@Injectable()
export class VideoResolver implements Resolve<HelixVideo[]> {

  constructor(private twitchService: TwitchService,
              private dashboardService: DashboardService) {
  }

  resolve(): Observable<HelixVideo[]> {
    const analyzedVideos = this.dashboardService.getVideos();
    const twitchVideos = from(this.twitchService.getVideos());
    return forkJoin([analyzedVideos, twitchVideos]).pipe(
      map(allVideos => {
        const analyzedVideoIds = allVideos[0]
          .map(video => video.id.toString());
        const twitchVideos = allVideos[1];
        return twitchVideos
          .filter(video => !analyzedVideoIds.includes(video.id));
      })
    );
  }
}
