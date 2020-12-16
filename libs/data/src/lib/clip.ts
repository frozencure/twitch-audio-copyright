import { ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';

export interface Clip {
  id: string;
  title: string;
  embedUrl: string;
  creatorName: string;
  gameId: string;
  viewCount: number;
  createdAt: Date;
  thumbnailUrl: string;
  progress: ProcessingProgress;
  userAction: UserActionType;
}

export interface PartialClipDto {
  id?: string;
  title?: string;
  embedUrl?: string;
  creatorName?: string;
  gameId?: string;
  viewCount?: number;
  createdAt?: Date;
  thumbnailUrl?: string;
  progress?: ProcessingProgress;
  userAction?: UserActionType;
}
