import { Component, Input } from '@angular/core';
import { videoThumbnailUrl } from '../../utils/video.manager';
import { HelixVideo } from 'twitch';
import { TimeConversion } from '@twitch-audio-copyright/data';

@Component({
  selector: 'app-confirm-videos',
  templateUrl: './confirm-videos.component.html',
  styleUrls: ['./confirm-videos.component.scss', './../dashboard/dashboard.component.scss']
})
export class ConfirmVideosComponent {

  @Input() selectedVideos: HelixVideo[];
  displayedColumns = ['info', 'created_at', 'views', 'duration'];
  public getThumbnailUrl = videoThumbnailUrl;

  public getTotalVideosDuration(): string {
    if (this.selectedVideos.length === 0) {
      return TimeConversion.secondsToHoursMinutesSeconds(0, true);
    }
    const totalDurationInSeconds = this.selectedVideos.map(video => video.durationInSeconds)
      .reduce((a, b) => a + b);
    return TimeConversion.secondsToHoursMinutesSeconds(totalDurationInSeconds, true);
  }

}
