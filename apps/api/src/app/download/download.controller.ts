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

@Controller('/download')
export class DownloadController {
  constructor(private readonly vodDownloadService: DownloadService,
              private readonly videosService: VideosService,
              private readonly authService: AuthService,
              private readonly twitchService: TwitchService) {
  }


  private static tempPath = `/home/iancu/Downloads/m3u8`

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
      return new SuccessDto(`Download for video ${id} successfully queued.`);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Post('/clip')
  @UseGuards(TokenGuard)
  public async downloadClip(@Token() token: string,
                            @Body() clip: ClipDto,
                            @Query('output') outputPath = DownloadController.tempPath,
                            @Query('delete_temp_files') deleteTempFiles = true): Promise<SuccessDto> {

    this.vodDownloadService.scheduleClipDownloadJob(clip,
      token, outputPath, deleteTempFiles).subscribe(() => {
      Logger.log('Added new download job.');
    });
    return new SuccessDto('DOWNLOAD_STARTED');
  }
}
