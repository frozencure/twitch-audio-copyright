import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { VideosService } from '../database/video/videos.service';
import { TokenGuard } from '../auth/token-guard.service';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { AuthService } from '../auth/auth.service';
import { TwitchService } from '../twitch/twitch.service';
import { Token, User } from '../utils/decorators';
import {
  ClipDownload,
  ClipsDownloadRequestModel,
  ClipsDownloadResponseModel,
  HttpExceptionModel,
  TwitchClipDto,
  TwitchVideoDto,
  VideoDownload,
  VideoDownloadRequestModel,
  VideosDownloadResponseModel
} from '@twitch-audio-copyright/data';
import { DownloadService } from './service/download.service';
import { ClipsService } from '../database/clip/clips.service';
import { ConfigService } from '@nestjs/config';
import { UserNotFoundError } from '../database/errors';
import { NoUserDatabaseHttpError, UnknownHttpError } from '../errors';

@Controller('/download')
export class DownloadController {

  private readonly temporaryFilesPath: string;
  private readonly videoChunkLength: number;
  private readonly shouldDeleteVideoFiles: boolean;
  private shouldDeleteClipFiles: boolean;

  constructor(private readonly vodDownloadService: DownloadService,
              private readonly videosService: VideosService,
              private readonly clipsService: ClipsService,
              private readonly authService: AuthService,
              private readonly twitchService: TwitchService,
              private readonly configService: ConfigService) {
    this.temporaryFilesPath = this.configService.get<string>('download.temp_path');
    this.videoChunkLength = this.configService.get<number>('download.video_batch_size');
    this.shouldDeleteClipFiles = this.configService.get<boolean>('download.remove_temp_video');
    this.shouldDeleteVideoFiles = this.configService.get<boolean>('download.remove_temp_clip');
  }

  @Post('/videos')
  @UseGuards(TokenGuard)
  public async downloadVideos(@User() user: UserCookieModel,
                              @Token() authToken: string,
                              @Body() videoDownloadModel: VideoDownloadRequestModel):
    Promise<VideosDownloadResponseModel> {
    try {
      const downloads = new Array<VideoDownload>();
      for (const video of videoDownloadModel.videos) {
        const result = await this.downloadVideo(video, authToken, user);
        downloads.push(result);
      }
      return { videoDownloads: downloads };
    } catch (e) {
      Logger.error(e);
      throw new UnknownHttpError(e.message);
    }
  }

  private async downloadVideo(video: TwitchVideoDto, authToken: string, user: UserCookieModel): Promise<VideoDownload> {
    try {
      this.vodDownloadService.scheduleVideoDownloadJob(video.id, authToken,
        this.temporaryFilesPath, this.videoChunkLength, this.shouldDeleteVideoFiles);
      await this.videosService.insertOrUpdate(user.id, video);
      Logger.log(`Download for video ${video.id} successfully queued.`);
      return new VideoDownload(video, 'Success');
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        const error = new NoUserDatabaseHttpError(e.message);
        return new VideoDownload(video, 'Failure', error.getResponse() as HttpExceptionModel);
      } else {
        const error = new UnknownHttpError(e.message);
        return new VideoDownload(video, 'Failure', error.getResponse() as HttpExceptionModel);
      }
    }
  }

  @Post('/clips')
  @UseGuards(TokenGuard)
  public async downloadClips(@Token() token: string,
                             @Body() clipsRequestModel: ClipsDownloadRequestModel): Promise<ClipsDownloadResponseModel> {
    try {
      const downloads = new Array<ClipDownload>();
      for (const clip of clipsRequestModel.clips) {
        const result = await this.downloadClip(clip, token);
        downloads.push(result);
      }
      return { clipDownloads: downloads };
    } catch (e) {
      Logger.error(e);
      throw new UnknownHttpError(e.message);
    }
  }

  private async downloadClip(twitchClip: TwitchClipDto, token: string): Promise<ClipDownload> {
    try {
      const clip = await this.clipsService.insertOrUpdate(twitchClip);
      await this.vodDownloadService.scheduleClipDownloadJob(clip,
        token, this.temporaryFilesPath, this.shouldDeleteClipFiles).toPromise();
      Logger.log(`Download for clip ${twitchClip.id} successfully queued.`);
      return new ClipDownload(twitchClip, 'Success');
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        const error = new NoUserDatabaseHttpError(e.message);
        return new ClipDownload(twitchClip, 'Failure', error.getResponse() as HttpExceptionModel);
      } else {
        const error = new UnknownHttpError(e.message);
        return new ClipDownload(twitchClip, 'Failure', error.getResponse() as HttpExceptionModel);
      }
    }
  }
}
