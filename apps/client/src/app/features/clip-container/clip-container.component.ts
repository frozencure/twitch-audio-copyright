import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelixClip, HelixGame } from 'twitch';
import { SubSink } from 'subsink';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clip-container',
  templateUrl: './clip-container.component.html',
  styleUrls: ['./clip-container.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipContainerComponent implements OnInit, OnDestroy {

  clips$: Observable<HelixClip[]>;
  games$: Observable<HelixGame[]>;
  selectedClips: HelixClip[] = [];
  private subSink = new SubSink();

  constructor(private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subSink.sink = this.activeRoute.data.subscribe(data => {
      this.clips$ = data.routeResolver.clipsStream;
      this.games$ = data.routeResolver.gamesStream;
    }, err => console.log(err));
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public selectClips(clips: HelixClip[]): void {
    this.selectedClips = clips;
  }
}

