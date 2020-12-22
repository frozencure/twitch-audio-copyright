import { Component } from '@angular/core';
import { HelixVideo } from 'twitch';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { TwitchService } from '../../core/services/twitch.service';
import { combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.scss', './../dashboard/dashboard.component.scss']
})
export class VideoContainerComponent {

  public videos$: Observable<HelixVideo[]>;
  public selectedVideos: HelixVideo[] = [];

  constructor(private activateRoute: ActivatedRoute,
              private dashboardService: DashboardService,
              private twitchService: TwitchService) {
    this.videos$ = this.filterVideos();
  }

  public selectVideos(selected: HelixVideo[]) {
    this.selectedVideos = selected;
  }

  private filterVideos(): Observable<HelixVideo[]> {
    const analyzedVideos = this.dashboardService.getVideos();
    const twitchVideos = from(this.twitchService.getVideos());
    return combineLatest([analyzedVideos, twitchVideos]).pipe(
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
