import { Observable } from 'rxjs';
import { Video } from './Video';
import { Clip } from './Clip';

export interface VideoResolverModel {
  type: VideoType;
  stream: Observable<Video[] | Clip[]>;
}

export enum VideoType {
  VIDEOS = 'videos',
  CLIPS = 'clips'
}
