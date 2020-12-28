import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { TimeConversion, UserActionType, Video } from '@twitch-audio-copyright/data';
import { SubSink } from 'subsink';
import { videoThumbnailUrl } from '../../../utils/video.manager';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-video-results',
  templateUrl: './video-results.component.html',
  styleUrls: ['./video-results.component.scss']
})
export class VideoResultsComponent implements OnInit, OnDestroy {

  videos: Video[];
  subSink = new SubSink();
  isLoading = false;
  UserActionType = UserActionType;
  getThumbnailUrl = videoThumbnailUrl;
  selectSubject = new BehaviorSubject(UserActionType.NEEDS_REVIEW);
  selectedValue: string;

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subSink.sink = this.filteredVideos(this.selectSubject).subscribe(videos => {
      this.videos = videos;
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private filteredVideos(selectStream: Observable<UserActionType>): Observable<Video[]> {
    return selectStream.pipe(
      switchMap(selectValue => {
        this.selectedValue = selectValue.toString();
        return this.dashboardService.getVideos(null, selectValue);
      })
    );
  }

  formatDuration(seconds: number): string {
    return TimeConversion.secondsToHoursMinutesSeconds(seconds, true);
  }

  onSelect(value: UserActionType) {
    this.isLoading = true;
    this.selectSubject.next(value);
  }
}
