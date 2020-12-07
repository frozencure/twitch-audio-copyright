import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { HomeResolverModel } from './home-resolver-model';

@Injectable()
export class HomeContainerResolver implements Resolve<HomeResolverModel> {

  constructor(private dashboardService: DashboardService) {
  }

  resolve(route: ActivatedRouteSnapshot): HomeResolverModel {
    const videos = this.dashboardService.getVideos();
    const clips = this.dashboardService.getClips();
    return {
      videosStream: videos,
      clipsStream: clips
    };
  }

}
