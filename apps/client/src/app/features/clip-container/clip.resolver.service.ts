import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { from } from 'rxjs';
import { TwitchService } from '../../core/services/twitch.service';
import { ClipResolverModel } from './clip-resolver-model';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class ClipResolver implements Resolve<ClipResolverModel> {

  constructor(private twitchService: TwitchService) {
  }

  resolve(): ClipResolverModel {
    const clips$ = from(this.twitchService.getClips());
    const games$ = clips$.pipe(
      map(clips => clips.map(clip => clip.gameId)),
      map(gameIds => from(this.twitchService.getGames(gameIds))),
      mergeMap(games => games)
    );
    return {clipsStream: clips$, gamesStream: games$};
  }
}

