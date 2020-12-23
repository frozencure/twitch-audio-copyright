import { Component } from '@angular/core';
import { HelixClip, HelixGame } from 'twitch';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { TwitchService } from '../../core/services/twitch.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-clip-container',
  templateUrl: './clip-container.component.html',
  styleUrls: ['./clip-container.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipContainerComponent {

  clips$: Observable<HelixClip[]>;
  games$: Observable<HelixGame[]>;
  selectedClips: HelixClip[] = [];

  constructor(private twitchService: TwitchService,
              private dashboardService: DashboardService) {
    this.clips$ = this.getFilteredClips();
    this.games$ = this.getGames(this.clips$);
  }

  public selectClips(clips: HelixClip[]): void {
    this.selectedClips = clips;
  }

  private getFilteredClips(): Observable<HelixClip[]> {
    const twitchClips = from(this.twitchService.getClips());
    const analyzedClips = this.dashboardService.getClips();
    return combineLatest([twitchClips, analyzedClips]).pipe(
      map(allClips => {
        const twitchClips = allClips[0];
        const analyzedClipIds = allClips[1].map(clip => clip.id);
        return twitchClips.filter(clip => !analyzedClipIds.includes(clip.id));
      })
    );
  }

  private getGames(forClips: Observable<HelixClip[]>): Observable<HelixGame[]> {
    return forClips.pipe(
      map(clips => clips.map(clip => clip.gameId)),
      map(gameIds => from(this.twitchService.getGames(gameIds))),
      mergeMap(games => games)
    );
  }
}

