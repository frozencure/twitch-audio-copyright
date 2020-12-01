import { Observable } from 'rxjs';
import { Video } from './Video';
import { TwitchClipDto } from '@twitch-audio-copyright/data';

export interface VideoResolverModel {
  type: VideoType;
  stream: Observable<Video[] | TwitchClipDto[]>;
}

export enum VideoType {
  VIDEOS = 'videos',
  CLIPS = 'clips'
}
