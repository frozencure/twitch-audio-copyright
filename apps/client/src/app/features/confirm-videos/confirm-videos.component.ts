import { Component, Input } from '@angular/core';
import { Video } from '../../shared/model/Video';
import { getMillisFromString, getStringFromMilliseconds, thumbnailUrl } from '../../utils/video.manager';

@Component({
  selector: 'app-confirm-videos',
  templateUrl: './confirm-videos.component.html',
  styleUrls: ['./confirm-videos.component.scss']
})
export class ConfirmVideosComponent {

  @Input() selectedVideos: Video[];
  displayedColumns = ['info', 'title', 'created_at', 'views'];
  public getThumbnailUrl = thumbnailUrl;

  public getTotalVideosDuration() {
    return getStringFromMilliseconds(this.selectedVideos.reduce((a, b) => a + getMillisFromString(b.duration), 0) || 0);
  }

}
