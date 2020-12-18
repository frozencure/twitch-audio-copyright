import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Clip, LiveSong, Video } from '@twitch-audio-copyright/data';
import { DashboardItemType } from '../../shared/model/dashboard-item-type';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss']
})
export class HomeContainerComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private dashboardService: DashboardService) {
  }

  clipType = DashboardItemType.CLIP;
  videoType = DashboardItemType.VIDEO;

  videos$: Observable<Video[]>;
  clips$: Observable<Clip[]>;
  liveSongs$: Observable<LiveSong[]>;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.videos$ = data.routeResolver.videosStream;
      this.clips$ = data.routeResolver.clipsStream;
      this.liveSongs$ = data.routeResolver.liveSongsStream;
    }, err => console.log(err));
  }

  onLiveCardRefresh(): void {
    this.dashboardService.refreshLiveSongs();
  }

  onCardRefresh(type: DashboardItemType): void {
    switch (type) {
      case DashboardItemType.VIDEO:
        this.dashboardService.refreshVideos();
        break;
      case DashboardItemType.CLIP:
        this.dashboardService.refreshClips();
        break;
    }
  }
}
