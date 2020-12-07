import { Observable } from 'rxjs';
import { VideoDto, ClipDto } from '@twitch-audio-copyright/data';

export interface HomeResolverModel {
  videosStream: Observable<VideoDto[]>;
  clipsStream: Observable<ClipDto[]>
}
