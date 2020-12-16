import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
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

@Controller('videos/')
export class VideoController {

  constructor(private readonly videosService: VideosService) {
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getVideos(@User() user: UserCookieModel,
                         @Query('progress') progress?: ProcessingProgress,
                         @Query('action') action?: UserActionType): Promise<Video[]> {
    return await this.videosService.findAll(user.id, progress, action);
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  public async update(@Body() updateModel: PartialVideoDto,
                      @Param('id') videoId: number): Promise<UpdateResult> {
    updateModel.id = videoId;
    return await this.videosService.updateVideo(updateModel);
  }

  @Get(':id/songs')
  @UseGuards(TokenGuard)
  public async getIdentifiedSongs(@Param('id') videoId: number): Promise<IdentifiedSong[]> {
    const video = await this.videosService.findOne(videoId, ['identifiedSongs', 'label', 'identifiedSongs.label']);
    return video.identifiedSongs.map(song => song.toIdentifiedSongDto());
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  public async getVideo(@Param('id') videoId: number): Promise<Video> {
    return await this.videosService.findOne(videoId);
  }
}
