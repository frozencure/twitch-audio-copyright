import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { VideoResolverModel, VideoType } from '../model/VideoResolverModel';

@Injectable()
export class VideoResolver implements Resolve<VideoResolverModel> {

  constructor(private videos: DashboardService) {
  }

  resolve(route: ActivatedRouteSnapshot): VideoResolverModel {
    const type = route.paramMap.get('type');
    switch (type) {
      case VideoType.VIDEOS:
        return { type, stream: this.videos.getVideos() };
      case VideoType.CLIPS:
        return { type, stream: this.videos.getClips() };
    }
  }
}

