import { HttpExceptionModel, TwitchClipDto } from '../..';

export class ClipDownload {
  clip: TwitchClipDto;
  status: string;
  error?: HttpExceptionModel;

  constructor(clip: TwitchClipDto, status: string, error?: HttpExceptionModel) {
    this.clip = clip;
    this.status = status;
    this.error = error;
  }
}

export interface ClipsDownloadResponseModel {
  clipDownloads: ClipDownload[]
}
