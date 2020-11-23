import { Body, Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { VodDownloadService } from './service/vod-download.service';
import { VideosService } from '../database/video/VideosService';
import { TokenGuard } from '../auth/token-guard.service';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { AuthService } from '../auth/auth.service';
import { TwitchService } from '../twitch/twitch.service';
import { Token, User } from '../utils/decorators';
import { SuccessDto } from '@twitch-audio-copyright/data';
import { TwitchClipDto } from '../../../../../libs/data/src/lib/twitch-clip-dto';

@Controller('/vod')
export class VodDownloadController {
  constructor(private readonly vodDownloadService: VodDownloadService,
              private readonly videosService: VideosService,
              private readonly authService: AuthService,
              private readonly twitchService: TwitchService) {
  }

  @Get('video/:id')
  @UseGuards(TokenGuard)
  public async downloadVod(@User() user: UserCookieModel,
                           @Token() authToken: string,
                           @Param('id') id,
                           @Query('output') outputPath = '/home/iancu/Downloads/m3u8',
                           @Query('split') batchSize = 60,
                           @Query('delete_temp_files') deleteTempFiles = true) {
    const job = await this.vodDownloadService.scheduleDownloadJob(id, authToken, outputPath, batchSize, deleteTempFiles).toPromise();
    Logger.debug(`Added new download job for video with ID ${job.data.vodId}`);
    const twitchVideo = await this.twitchService.getVideo(authToken, id);
    const dbVideo = await this.videosService.insertOrUpdate((user as UserCookieModel).id, twitchVideo);
    Logger.debug(`Saved video with ID ${dbVideo.id} to database.`);
    return `Download for video ${id} successfully queued.`;
  }


  @Post('/clip')
  @UseGuards(TokenGuard)
  public async downloadClip(@Token() token: string,
                            @Body() clip: TwitchClipDto,
                            @Query('output') outputPath = '/Users/andyradulescu/Desktop/twitchDownlaods',
                            @Query('delete_temp_files') deleteTempFiles = true): Promise<SuccessDto> {

    this.vodDownloadService.scheduleClipDownloadJob(clip,
      token, outputPath, deleteTempFiles).subscribe(() => {
      Logger.log('Added new download job.');
    });
    return new SuccessDto('DOWNLOAD_STARTED');
  }
}
