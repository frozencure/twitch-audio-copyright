import { ProcessingProgress } from './processing-progress';
import { UserActionType } from './user-action-type';


export enum VideoType {
  UPLOAD = 'upload',
  ARCHIVE = 'archive',
  HIGHLIGHT = 'highlight'
}

export class Video {
  id: number;
  title: string;
  description: string;
  type: VideoType;
  url: string;
  views: number;
  isPublic: boolean;
  durationInSeconds: number;
  language: string;
  createdAt: Date;
  publishedAt: Date;
  progress: ProcessingProgress;
  userAction: UserActionType;
  thumbnailUrl: string;
}

export interface PartialVideoDto {
  id?: number;
  title?: string;
  description?: string;
  type?: VideoType;
  url?: string;
  views?: number;
  isPublic?: boolean;
  durationInSeconds?: number;
  language?: string;
  createdAt?: Date;
  publishedAt?: Date;
  progress?: ProcessingProgress;
  userAction?: UserActionType;
}
