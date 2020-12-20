import { HelixClip, HelixGame } from 'twitch';
import { Observable } from 'rxjs';

export interface ClipResolverModel {
  clipsStream: Observable<HelixClip[]>;
  gamesStream: Observable<HelixGame[]>;
}
