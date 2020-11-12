import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Injectable()
export class VideoResolver implements Resolve<any> {

  constructor(private videos: DashboardService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const type = route.paramMap.get('type');
    switch (type) {
      case 'videos':
        return { type, stream: this.videos.getVideos() };
      case 'clips':
        return { type, stream: this.videos.getClips() };
    }
  }

}
