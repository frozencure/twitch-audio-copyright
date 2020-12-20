import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, from, Observable } from 'rxjs';
import { TwitchService } from '../../core/services/twitch.service';
import { ClipResolverModel } from './clip-resolver-model';
import { map, mergeMap } from 'rxjs/operators';
import { HelixClip } from 'twitch';
import { Clip } from '@twitch-audio-copyright/data';
import { DashboardService } from '../../core/services/dashboard.service';

@Injectable()
export class ClipResolver implements Resolve<ClipResolverModel> {

  constructor(private twitchService: TwitchService,
              private dashboardService: DashboardService) {
  }

  resolve(): ClipResolverModel {
    const twitchClips = from(this.twitchService.getClips());
    const analyzedClips = this.dashboardService.getClips();
    const clips$ = ClipResolver.removeAnalyzedClips(twitchClips, analyzedClips);
    const games$ = clips$.pipe(
      map(clips => clips.map(clip => clip.gameId)),
      map(gameIds => from(this.twitchService.getGames(gameIds))),
      mergeMap(games => games)
    );
    return { clipsStream: clips$, gamesStream: games$ };
  }

  private static removeAnalyzedClips(twitchClips: Observable<HelixClip[]>,
                                     analyzedClips: Observable<Clip[]>): Observable<HelixClip[]> {
    return forkJoin([twitchClips, analyzedClips]).pipe(
      map(allClips => {
        const twitchClips = allClips[0];
        const analyzedClipIds = allClips[1].map(clip => clip.id);
        return twitchClips.filter(clip => !analyzedClipIds.includes(clip.id));
      })
    );
  }
}

