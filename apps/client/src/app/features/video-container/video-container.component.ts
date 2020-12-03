import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../shared/model/Video';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.scss']
})
export class VideoContainerComponent implements OnInit {
  public videos$: Observable<Video[]>;
  public type: string;

  public secondFormGroup: FormGroup;
  public selectedVideos: Video[] = [];

  constructor(private actRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.actRoute.data.subscribe(data => {
      this.type = data.routeResolver.type;
      this.videos$ = data.routeResolver.stream;
    }, err => console.log(err));
  }

  public selectVideos(event) {
    this.selectedVideos = event;
  }
}
