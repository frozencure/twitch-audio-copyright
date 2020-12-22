import { Body, Controller, Get, Logger, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../auth/token-guard.service';
import { User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { VideosService } from '../database/video/videos.service';
import {
  IdentifiedSong,
  PartialVideoDto,
  ProcessingProgress,
  UserActionType,
  Video
} from '@twitch-audio-copyright/data';
import { UpdateResult } from 'typeorm';
import { UserNotFoundError } from '../database/errors';
import { NoUserDatabaseHttpError, UnknownDatabaseHttpError } from '../errors';

@Controller('videos/')
export class VideoController {

  constructor(private readonly videosService: VideosService) {
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
                      @Param('id') videoId: number): Promise<UpdateResult> {
    updateModel.id = videoId;
    try {
      return await this.videosService.updateVideo(updateModel);
    } catch (e) {
      Logger.error(e);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }

  @Get(':id/songs')
  @UseGuards(TokenGuard)
  public async getIdentifiedSongs(@Param('id') videoId: number): Promise<IdentifiedSong[]> {
    try {
      const video = await this.videosService.findOne(videoId, ['identifiedSongs', 'label', 'identifiedSongs.label']);
      return video.identifiedSongs.map(song => song.toIdentifiedSongDto());
    } catch (e) {
      Logger.error(e);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  public async getVideo(@Param('id') videoId: number): Promise<Video> {
    try {
      return await this.videosService.findOne(videoId);
    } catch (e) {
      Logger.error(e);
      throw new UnknownDatabaseHttpError(e.message);
    }
  }
}
