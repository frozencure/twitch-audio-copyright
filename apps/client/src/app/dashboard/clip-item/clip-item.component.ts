import { Component, Input, OnInit } from '@angular/core';
import { timeSince, views, withWidthAndHeight } from '../../utils/video.manager';
import { Clip } from '../model/Clip';

@Component({
  selector: 'app-clip-item',
  templateUrl: './clip-item.component.html',
  styleUrls: [ './clip-item.component.scss' ]
})
export class ClipItemComponent implements OnInit {
  @Input() clip: Clip;
  public backgroundUrl: string;
  public duration;
  public views;
  public timeSince;

  constructor() {
  }

  ngOnInit(): void {
    this.backgroundUrl = withWidthAndHeight(this.clip.thumbnail_url, 320, 180);
    this.views = views(this.clip.view_count);
    this.timeSince = timeSince(this.clip.created_at);
  }

}
