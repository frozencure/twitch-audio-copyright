import { Component, Input, OnInit } from '@angular/core';
import { Video } from '@twitch-audio-copyright/data';
import { videoSquareThumbnailUrl, videoThumbnailUrl } from '../../../utils/video.manager';

@Component({
  selector: 'app-video-result-card',
  templateUrl: './video-result-card.component.html',
  styleUrls: ['./video-result-card.component.scss']
})
export class VideoResultCardComponent implements OnInit {

  @Input() video: Video;
  @Input() songCount: number;
  @Input() songsDuration: number;
  getVideoThumbnail = videoThumbnailUrl;

  constructor() {
  }

  ngOnInit(): void {
  }

}
