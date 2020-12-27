import { Body, Controller, Get, Logger, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../auth/token-guard.service';
import { Token, User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { VideosService } from '../database/video/videos.service';
import {
  IdentifiedSong,
  PartialVideoDto,
  ProcessingProgress,
  UserActionType,
  Video
} from '@twitch-audio-copyright/data';
import { UserNotFoundError } from '../database/errors';
import { NoUserDatabaseHttpError, TwitchHttpError, UnknownDatabaseHttpError } from '../errors';
import { IdentifiedSongsService } from '../database/identified-song/identified-songs.service';
import { TwitchService } from '../twitch/twitch.service';

@Controller('videos/')
export class VideoController {

  constructor(private readonly videosService: VideosService,
              private readonly identifiedSongsService: IdentifiedSongsService,
              private readonly twitchService: TwitchService) {
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getVideos(@User() user: UserCookieModel,
                         @Query('progress') progress?: ProcessingProgress,
                         @Query('action') action?: UserActionType): Promise<Video[]> {
    try {
      return await this.videosService.findAll(user.id, progress, action);
    } catch (e) {
      Logger.error(e);
      if (e instanceof UserNotFoundError) {
        throw new NoUserDatabaseHttpError(e.message);
      } else {
        throw new UnknownDatabaseHttpError(e.message);
      }
    }
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  public async update(@Body() updateModel: PartialVideoDto,
                      @Param('id') videoId: number,
                      @Token() authToken: string): Promise<Video> {
    updateModel.id = videoId;
    await this.notifyTwitchOfUpdate(updateModel, videoId, authToken);
    try {
      await this.videosService.updateVideo(updateModel);
      const video = await this.videosService.findOne(videoId);
      return video.toVideoDto();
    } catch (e) {
      Logger.error(e.message);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }

  private async notifyTwitchOfUpdate(updateModel: PartialVideoDto,
                                     videoId: number,
                                     authToken: string): Promise<void> {
    if (updateModel.userAction === UserActionType.UNPUBLISHED) {
      try {
        await this.twitchService.unpublishVideo(authToken, videoId);
      } catch (e) {
        Logger.error(e.message);
        throw new TwitchHttpError(`Video could not be unpublished. Status (${e.response.status}, ` +
          `${e.response.statusText}) received from Twitch API.`);
      }
    } else if (updateModel.userAction === UserActionType.REMOVED) {
      try {
        await this.twitchService.deleteVideo(authToken, videoId);
      } catch (e) {
        Logger.error(e);
        throw new TwitchHttpError(`Video could not be removed. Status (${e.response.status}, ` +
          `${e.response.statusText}) received from Twitch API.`);
      }
    }
  }

  @Get(':id/songs')
  @UseGuards(TokenGuard)
  public async getIdentifiedSongs(@Param('id')
                                    videoId: number): Promise<IdentifiedSong[]> {
    try {
      const songs = await this.identifiedSongsService.findAllForVideo(videoId);
      return this.identifiedSongsService.mergeSongs(songs.map(song => song.toIdentifiedSongDto()));
    } catch (e) {
      Logger.error(e.message);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  public async getVideo(@Param('id')
                          videoId: number): Promise<Video> {
    try {
      return await this.videosService.findOne(videoId);
    } catch (e) {
      Logger.error(e);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }
}
