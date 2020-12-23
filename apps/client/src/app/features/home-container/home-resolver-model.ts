import { Observable } from 'rxjs';
import { Clip, LiveSongsResults, Video } from '@twitch-audio-copyright/data';

export interface HomeResolverModel {
  videosStream: Observable<Video[]>;
  clipsStream: Observable<Clip[]>;
  songsStream: Observable<LiveSongsResults>
}
