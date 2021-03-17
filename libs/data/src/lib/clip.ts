import { IdentifiedSong, ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';

export class Clip {
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
  identifiedSongs?: IdentifiedSong[]
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
