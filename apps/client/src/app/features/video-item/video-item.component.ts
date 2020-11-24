import { AfterViewInit, Component, Input } from '@angular/core';
import { Video } from '../../shared/model/Video';
import { duration, timeSince, views, withWidthAndHeight } from '../../utils/video.manager';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: [ './video-item.component.scss' ]
})
export class VideoItemComponent implements AfterViewInit {
  @Input() video: Video;
  public backgroundUrl: string;
  public duration: string;
  public views: string;
  public timeSince: string;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.backgroundUrl = withWidthAndHeight(this.video.thumbnail_url, 320, 180);
    this.duration = duration(this.video.duration);
    this.views = views(this.video.view_count);
    this.timeSince = timeSince(this.video.created_at);
  }
}
