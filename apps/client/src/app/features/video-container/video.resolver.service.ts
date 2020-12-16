import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { Observable } from 'rxjs';
import { TwitchVideoDto } from '../../shared/model/TwitchVideoDto';

@Injectable()
export class VideoResolver implements Resolve<TwitchVideoDto[]> {

  constructor(private videos: DashboardService) {
  }

  resolve(): Observable<TwitchVideoDto[]> {
    return this.videos.getTwitchVideos();
  }
}

