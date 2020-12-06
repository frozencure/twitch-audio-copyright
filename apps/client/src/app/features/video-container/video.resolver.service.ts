import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { Observable } from 'rxjs';
import { Video } from '../../shared/model/Video';

@Injectable()
export class VideoResolver implements Resolve<Video[]> {

  constructor(private videos: DashboardService) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Video[]> {
    return this.videos.getVideos();
  }
}

