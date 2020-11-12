import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs';
import { Video } from '../model/Video';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: [ './video-container.component.scss' ]
})
export class VideoContainerComponent implements OnInit {
  public videos$: Observable<Video[]>;

  constructor(private videos: DashboardService) {
  }

  ngOnInit(): void {
    this.videos$ = this.videos.getVideos();
  }

}
