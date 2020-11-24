import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Video } from '../../shared/model/Video';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.scss']
})
export class VideoContainerComponent implements OnInit {
  public videos$: Observable<Video[]>;
  public type: string;
  public isLoadingResults: boolean;
  displayedColumns: string[] = ['created', 'state', 'number', 'title'];

  constructor(private actRoute: ActivatedRoute) {
    this.isLoadingResults = false;
  }

  ngOnInit(): void {
    this.actRoute.data.subscribe(data => {
      this.type = data.routeResolver.type;
      this.videos$ = data.routeResolver.stream;
      this.isLoadingResults = true;
    }, err => console.log(err));
  }

}
