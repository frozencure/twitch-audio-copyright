import { Component, Input, OnInit } from '@angular/core';
import { Video } from '../../shared/model/Video';

@Component({
  selector: 'app-confirm-videos',
  templateUrl: './confirm-videos.component.html',
  styleUrls: ['./confirm-videos.component.scss']
})
export class ConfirmVideosComponent implements OnInit {

  @Input() selectedVideos: Video[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
