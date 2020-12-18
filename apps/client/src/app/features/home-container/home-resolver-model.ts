import { Observable } from 'rxjs';
import { Video, Clip, LiveSong } from '@twitch-audio-copyright/data';

export interface HomeResolverModel {
  videosStream: Observable<Video[]>;
  clipsStream: Observable<Clip[]>;
  liveSongsStream: Observable<LiveSong[]>;
}
