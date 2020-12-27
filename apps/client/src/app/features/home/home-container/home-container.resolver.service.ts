import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { HomeResolverModel } from './home-resolver-model';
import { map } from 'rxjs/operators';

@Injectable()
export class HomeContainerResolver implements Resolve<HomeResolverModel> {

  constructor(private dashboardService: DashboardService) {
  }

  resolve(): HomeResolverModel {
    const videos = this.dashboardService.getVideos();
    const clips = this.dashboardService.getClips();
    const liveSongs = this.dashboardService.getLiveSongs();
    return {
      videosStream: videos,
      clipsStream: clips,
      songsStream: liveSongs
    };
  }

}
