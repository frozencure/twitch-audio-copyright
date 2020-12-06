import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../shared/model/Video';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.scss']
})
export class VideoContainerComponent implements OnInit {
  public videos: Video[];

  public selectedVideos: Video[] = [];

  constructor(private actRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.actRoute.data.subscribe(data => {
      this.videos = data.routeResolver;
    }, err => console.log(err));
  }

  public selectVideos(event) {
    this.selectedVideos = event;
  }
}
