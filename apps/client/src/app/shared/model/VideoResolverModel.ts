import { Observable } from 'rxjs';
import { Video } from './Video';
import { ClipDto } from '@twitch-audio-copyright/data';

export interface VideoResolverModel {
  type: VideoType;
  stream: Observable<Video[] | ClipDto[]>;
}

export enum VideoType {
  VIDEOS = 'videos',
  CLIPS = 'clips'
}
