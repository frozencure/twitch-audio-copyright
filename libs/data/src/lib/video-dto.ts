import { ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';

export enum VideoType {
  UPLOAD = 'upload',
  ARCHIVE = 'archive',
  HIGHLIGHT = 'highlight'
}

export interface VideoDto {
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