import { HttpExceptionModel, TwitchClipDto, TwitchVideoDto } from '@twitch-audio-copyright/data';

export interface DownloadDialogResult {
  item: TwitchVideoDto | TwitchClipDto;
  status: string;
  error?: HttpExceptionModel;
}

export interface DownloadDialogData {
  results: DownloadDialogResult[];
  type: 'clip' | 'video';
}
