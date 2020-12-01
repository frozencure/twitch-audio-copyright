import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../auth/token-guard.service';
import { User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { VideosService } from '../database/video/videos.service';
import { PartialVideoDto, ProcessingProgress, UserActionType, VideoDto } from '@twitch-audio-copyright/data';
import IdentifiedSong from '../database/identified-song/identified-song.entity';

@Controller('videos/')
export class VideoController {

  constructor(private readonly videosService: VideosService) {
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getVideos(@User() user: UserCookieModel,
                         @Query('progress') progress?: ProcessingProgress,
                         @Query('action') action?: UserActionType): Promise<VideoDto[]> {
    return await this.videosService.findAll(user.id, progress, action);
  }

  @Patch(':id')
  @UseGuards(TokenGuard)
  public async update(@Body() updateModel: PartialVideoDto,
                      @Param('id') videoId: number): Promise<VideoDto> {
    updateModel.id = videoId;
    return await this.videosService.updateVideo(updateModel);
  }

  @Get(':id/songs')
  @UseGuards(TokenGuard)
  public async getIdentifiedSongs(@Param('id') videoId: number): Promise<IdentifiedSong[]> {
    const video = await this.videosService.findOne(videoId, ['identifiedSongs']);
    return video.identifiedSongs;
  }

  @Get(':id')
  @UseGuards(TokenGuard)
  public async getVideo(@Param('id') videoId: number): Promise<VideoDto> {
    return await this.videosService.findOne(videoId);
  }


}
