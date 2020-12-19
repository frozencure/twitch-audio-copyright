import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwitchClipDto } from '@twitch-audio-copyright/data';

@Component({
  selector: 'app-clip-container',
  templateUrl: './clip-container.component.html',
  styleUrls: ['./clip-container.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipContainerComponent implements OnInit {

  clips: TwitchClipDto[];
  selectedClips: TwitchClipDto[] = [];

  constructor(private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activeRoute.data.subscribe(data => {
      this.clips = data.routeResolver;
    }, err => console.log(err));
  }

  public selectClips(clips: TwitchClipDto[]): void {
    this.selectedClips = clips;
  }
}

