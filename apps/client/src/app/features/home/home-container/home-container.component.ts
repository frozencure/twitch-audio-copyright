import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Clip, LiveSongsResults, Video } from '@twitch-audio-copyright/data';
import { DashboardItemType } from '../../../shared/model/dashboard-item-type';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss']
})
export class HomeContainerComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {
  }

  clipType = DashboardItemType.CLIP;
  videoType = DashboardItemType.VIDEO;

  videos$: Observable<Video[]>;
  clips$: Observable<Clip[]>;
  liveSongs$: Observable<LiveSongsResults>;

  clipsRefreshSubject = new BehaviorSubject(true);
  videosRefreshSubject = new BehaviorSubject(true);
  liveSongsRefreshSubject = new BehaviorSubject(true);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.videos$ =
        this.connectRefreshSubject(data.routeResolver.videosStream, this.videosRefreshSubject);
      this.clips$ =
        this.connectRefreshSubject(data.routeResolver.clipsStream, this.clipsRefreshSubject);
      this.liveSongs$ =
        this.connectRefreshSubject(data.routeResolver.songsStream, this.liveSongsRefreshSubject);
    }, err => console.log(err));
  }

  onLiveCardRefresh(): void {
    this.liveSongsRefreshSubject.next(true);
  }

  onCardRefresh(type: DashboardItemType): void {
    switch (type) {
      case DashboardItemType.VIDEO:
        this.videosRefreshSubject.next(true);
        break;
      case DashboardItemType.CLIP:
        this.clipsRefreshSubject.next(true);
        break;
    }
  }

  private connectRefreshSubject<T>(inputObservable: Observable<T>, subject: BehaviorSubject<boolean>): Observable<T> {
    return subject.pipe(
      switchMap(() => {
        return inputObservable;
      })
    );
  }
}
