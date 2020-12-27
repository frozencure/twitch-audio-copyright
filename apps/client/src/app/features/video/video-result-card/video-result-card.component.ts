import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeConversion, UserActionType, Video } from '@twitch-audio-copyright/data';
import { videoThumbnailUrl } from '../../../utils/video.manager';
import { DashboardService } from '../../../core/services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmAction } from '../../../shared/confirm-dialog/confirm-dialog-data';
import { Observable } from 'rxjs';
import { SpinnerService } from '../../../shared/spinner-dialog/spinner.service';

@Component({
  selector: 'app-video-result-card',
  templateUrl: './video-result-card.component.html',
  styleUrls: ['./video-result-card.component.scss']
})
export class VideoResultCardComponent {

  @Input() video: Video;
  @Input() songCount: number;
  @Input() songsDuration: number;
  @Output() refreshEmitter = new EventEmitter<Video>();

  getVideoThumbnail = videoThumbnailUrl;
  UserActionType = UserActionType;

  constructor(private dashboardService: DashboardService,
              private confirmDialog: MatDialog,
              private spinnerService: SpinnerService) {
  }

  goToVideo(video: Video) {
    window.open(video.url);
  }

  durationPercentage(): string {
    const percentage = Math.round(100 * this.songsDuration / this.video.durationInSeconds);
    return `${percentage}%`;
  }

  durationPipe(seconds: number) {
    return TimeConversion.secondsToHoursMinutesSeconds(seconds, true);
  }

  unpublishVideo(video: Video) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        contentTitle: 'Unpublish video',
        contentText: `Are you sure you want to unpublish ${video.title}?` +
          ` This will make it publicly inaccessible.`,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe((action: ConfirmAction) => {
      switch (action) {
        case ConfirmAction.CANCEL:
          break;
        case ConfirmAction.CONFIRM:
          this.spinnerService.showSpinner();
          this.onUpdateVideo(UserActionType.UNPUBLISHED);
          break;
      }
    });
  }

  private onUpdateVideo(userActionType: UserActionType): void {
    let request: Observable<Video>;
    if (userActionType === UserActionType.UNPUBLISHED) {
      request = this.dashboardService.updateVideo({
        id: this.video.id,
        userAction: userActionType,
        isPublic: false
      });
    } else {
      request = this.dashboardService.updateVideo({
        id: this.video.id,
        userAction: userActionType
      });
    }
    request.subscribe(video => {
      this.refreshEmitter.emit(video);
      this.spinnerService.hideSpinner();
    }, () => {
      this.spinnerService.hideSpinner();
    });
  }

  removeVideo(video: Video) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        contentTitle: 'Remove video',
        contentText: `Are you sure you want to remove ${video.title}?` +
          ` This action will remove the video from Twitch and is irreversible.`,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe((action: ConfirmAction) => {
      switch (action) {
        case ConfirmAction.CANCEL:
          break;
        case ConfirmAction.CONFIRM:
          this.spinnerService.showSpinner();
          this.onUpdateVideo(UserActionType.REMOVED);
          break;
      }
    });
  }

  keepVideo(video: Video) {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        contentTitle: 'Keep video public',
        contentText: `Are you sure you want to keep ${video.title} public?` +
          ` The video contains identified songs. Keeping the video public might lead to a DMCA strike.`,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }
    });
    dialogRef.afterClosed().subscribe((action: ConfirmAction) => {
      switch (action) {
        case ConfirmAction.CANCEL:
          break;
        case ConfirmAction.CONFIRM:
          this.spinnerService.showSpinner();
          this.onUpdateVideo(UserActionType.KEPT);
          break;
      }
    });
  }
}
