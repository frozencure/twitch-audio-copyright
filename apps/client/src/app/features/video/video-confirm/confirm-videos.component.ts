import { Component, Input } from '@angular/core';
import { videoSquareThumbnailUrl } from '../../../utils/video.manager';
import { HelixVideo } from 'twitch';
import { TimeConversion } from '@twitch-audio-copyright/data';
import { DashboardService } from '../../../core/services/dashboard.service';
import { TwitchVideo } from '@twitch-audio-copyright/data';
import { map } from 'rxjs/operators';
import { DownloadDialogComponent } from '../../../shared/download-dialog/download-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-videos',
  templateUrl: './confirm-videos.component.html',
  styleUrls: ['./confirm-videos.component.scss', '../../dashboard/dashboard.component.scss']
})
export class ConfirmVideosComponent {

  constructor(private dashboardService: DashboardService,
              public dialog: MatDialog) {
  }

  @Input() selectedVideos: HelixVideo[];
  displayedColumns = ['title', 'created_at', 'views', 'duration'];
  public getThumbnailUrl = videoSquareThumbnailUrl;
  isLoading = false;

  public getTotalVideosDuration(): string {
    if (this.selectedVideos.length === 0) {
      return TimeConversion.secondsToHoursMinutesSeconds(0, true);
    }
    const totalDurationInSeconds = this.selectedVideos.map(video => video.durationInSeconds)
      .reduce((a, b) => a + b);
    return TimeConversion.secondsToHoursMinutesSeconds(totalDurationInSeconds, true);
  }

  onConfirm() {
    this.isLoading = true;
    this.dashboardService.downloadVideos(this.selectedVideos.map(helixVideo => new TwitchVideo(helixVideo)))
      .pipe(map(response => response.videoDownloads.map(result => {
        return { item: result.video, status: result.status, error: result.error };
      }))).subscribe(results => {
      this.isLoading = false;
      this.dialog.open(DownloadDialogComponent, {
        data: { type: 'video', results: results },
        disableClose: true,
        hasBackdrop: true
      });
    });
  }
}
