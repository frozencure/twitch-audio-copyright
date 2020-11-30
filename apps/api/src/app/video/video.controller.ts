import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TokenGuard } from '../auth/token-guard.service';
import { User } from '../utils/decorators';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import Video from '../database/video/video.entity';
import { VideosService } from '../database/video/videos.service';
import { ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';

@Controller('videos/')
export class VideoController {

  constructor(private readonly videosService: VideosService) {
  }

  @Get()
  @UseGuards(TokenGuard)
  public async getVideos(@User() user: UserCookieModel,
                         @Query('progress') progress?: ProcessingProgress,
                         @Query('action') action?: UserActionType): Promise<Video[]> {
    const videos = await this.videosService.getVideos(user.id, progress, action);
    this.videosService.hasIdentifiedSongs(videos.find(a => a).id).then();
    return videos;
  }
}
