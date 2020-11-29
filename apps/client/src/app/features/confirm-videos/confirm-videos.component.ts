import { Component, Input, OnInit } from '@angular/core';
import { Video } from '../../shared/model/Video';
import { thumbnailUrl } from '../../utils/video.manager';

@Component({
  selector: 'app-confirm-videos',
  templateUrl: './confirm-videos.component.html',
  styleUrls: ['./confirm-videos.component.scss']
})
export class ConfirmVideosComponent implements OnInit {

  @Input() selectedVideos: Video[];
  displayedColumns = ['info', 'title', 'created_at', 'views'];
  public getThumbnailUrl = thumbnailUrl;

  constructor() {
  }

  ngOnInit(): void {
  }

}
