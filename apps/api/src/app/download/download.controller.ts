import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { VideosService } from '../database/video/videos.service';
import { TokenGuard } from '../auth/token-guard.service';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { AuthService } from '../auth/auth.service';
import { TwitchService } from '../twitch/twitch.service';
import { Token, User } from '../utils/decorators';
import { ClipDto, SuccessDto } from '@twitch-audio-copyright/data';
import { DownloadService } from './service/download.service';
import { ClipsService } from '../database/clip/clips.service';

@Controller('/download')
export class DownloadController {
  constructor(private readonly vodDownloadService: DownloadService,
              private readonly videosService: VideosService,
              private readonly clipsService: ClipsService,
              private readonly authService: AuthService,
              private readonly twitchService: TwitchService) {
  }


  private static tempPath = `${__dirname}/assets/temp`;

  @Get('video/:id')
  @UseGuards(TokenGuard)
  public async downloadVod(@User() user: UserCookieModel,
                           @Token() authToken: string,
                           @Param('id') id,
                           @Query('output') outputPath = DownloadController.tempPath,
                           @Query('split') batchSize = 60,
                           @Query('delete_temp_files') deleteTempFiles = true) {
    try {
      const twitchVideo = await this.twitchService.getVideo(authToken, id);
      await this.videosService.insertOrUpdate(user.id, twitchVideo);
      await this.vodDownloadService.scheduleVideoDownloadJob(id, authToken,
        outputPath, batchSize, deleteTempFiles).toPromise();
      Logger.debug(`Download for video ${id} successfully queued.`);
      return new SuccessDto('DOWNLOAD_STARTED');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('/clip')
  @UseGuards(TokenGuard)
  public async downloadClip(@Token() token: string,
                            @Body() clipDto: ClipDto,
                            @Query('output') outputPath = DownloadController.tempPath,
                            @Query('delete_temp_files') deleteTempFiles = false): Promise<SuccessDto> {
    try {
      const twitchVideo = await this.twitchService.getVideo(token, clipDto.video_id);
      const video = await this.videosService.insertIfNotFound(clipDto.broadcaster_id, twitchVideo);
      const clip = await this.clipsService.insertOrUpdate(clipDto, video);
      this.vodDownloadService.scheduleClipDownloadJob(clip,
        token, outputPath, deleteTempFiles).subscribe(() => {
        Logger.debug(`Download for clip ${clipDto.id} successfully queued.`);
      });
      return new SuccessDto('DOWNLOAD_STARTED');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
