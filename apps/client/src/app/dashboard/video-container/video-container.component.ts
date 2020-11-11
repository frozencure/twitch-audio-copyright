import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: [ './video-container.component.scss' ]
})
export class VideoContainerComponent implements OnInit {

  constructor(private videos: DashboardService) {
  }

  ngOnInit(): void {
    this.videos.getVideos().subscribe(data => {
      console.log(data);
    });
  }

}
