import { Component, Input, OnInit } from '@angular/core';
import { timeSince, views, withWidthAndHeight } from '../../utils/video.manager';
import { TwitchClipDto } from '@twitch-audio-copyright/data';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-clip-item',
  templateUrl: './clip-item.component.html',
  styleUrls: ['./clip-item.component.scss']
})
export class ClipItemComponent implements OnInit {
  @Input() clip: TwitchClipDto;
  public backgroundUrl: string;
  public duration;
  public views;
  public timeSince;

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.backgroundUrl = withWidthAndHeight(this.clip.thumbnail_url, 320, 180);
    this.views = views(this.clip.view_count);
    this.timeSince = timeSince(this.clip.created_at);
  }

  onClipPress() {
    this.dashboardService.processClip(this.clip).subscribe(_ => console.log(_));
  }

}
