import { HttpExceptionModel, TwitchVideoDto } from '../..';

export class VideoDownload {
  video: TwitchVideoDto;
  status: string;
  error: HttpExceptionModel;

  constructor(video: TwitchVideoDto, status: string, error?: HttpExceptionModel) {
    this.video = video;
    this.status = status;
    this.error = error;
  }
}

export interface VideosDownloadResponseModel {
  videoDownloads: VideoDownload[]
}
