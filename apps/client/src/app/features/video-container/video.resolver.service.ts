import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TwitchClipDto } from '../../../../../../libs/data/src';
import { DashboardService } from '../../core/services/dashboard.service';
import { from, Observable } from 'rxjs';
import { HelixVideo } from 'twitch';
import { TwitchService } from '../../core/services/twitch.service';

@Injectable()
export class VideoResolver implements Resolve<HelixVideo[]> {

  constructor(private twitchService: TwitchService) {
  }

  resolve(): Observable<HelixVideo[]> {
    return from(this.twitchService.getVideos());
  }
}
