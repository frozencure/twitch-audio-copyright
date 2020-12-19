import { Component, OnInit } from '@angular/core';
import { HelixVideo } from 'twitch';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.scss', './../dashboard/dashboard.component.scss']
})
export class VideoContainerComponent implements OnInit {

  public videos: HelixVideo[];
  public selectedVideos: HelixVideo[] = [];

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.videos = data.routeResolver;
    }, err => console.log(err));
  }

  public selectVideos(selected: HelixVideo[]) {
    this.selectedVideos = selected;
  }
}
