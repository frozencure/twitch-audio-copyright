import { Observable } from 'rxjs';
import { Video, Clip } from '@twitch-audio-copyright/data';

export interface HomeResolverModel {
  videosStream: Observable<Video[]>;
  clipsStream: Observable<Clip[]>
}
