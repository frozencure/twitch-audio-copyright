import { Component, Input, OnInit } from '@angular/core';
import { getStringFromMilliseconds, videoThumbnailUrl } from '../../utils/video.manager';
import { TwitchClipDto } from '@twitch-audio-copyright/data';

@Component({
  selector: 'app-clip-confirm',
  templateUrl: './clip-confirm.component.html',
  styleUrls: ['./clip-confirm.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipConfirmComponent implements OnInit {

  @Input() selectedClips: TwitchClipDto[];
  displayedColumns = ['info', 'title', 'created_at', 'views'];
  public getThumbnailUrl = videoThumbnailUrl;

  constructor() {
  }

  ngOnInit(): void {
  }

  public getTotalClipsDuration() {
    return getStringFromMilliseconds(this.selectedClips.length * 60 * 1000);
  }

}
