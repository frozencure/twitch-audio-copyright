import { Controller, Get, Logger, Param, Query, Req, UseGuards } from '@nestjs/common';
import { VodDownloadService } from './service/vod-download.service';
import { VideosService } from '../database/video/VideosService';
import { UserCookie } from '../auth/user.decorator';
import { TokenGuard } from '../auth/token-guard.service';
import { UserCookieModel } from '../auth/model/user-cookie-model';
import { AuthService } from '../auth/auth.service';
import { TwitchService } from '../twitch/twitch.service';

@Controller('/vod')
export class VodDownloadController {
  constructor(private readonly vodDownloadService: VodDownloadService,
              private readonly videosService: VideosService,
              private readonly authService: AuthService,
              private readonly twitchService: TwitchService) {
  }

  @Get('download/:id')
  @UseGuards(TokenGuard)
  public async downloadVod(@UserCookie() user,
                           @Req() request,
                           @Param('id') id,
                           @Query('output') outputPath = '/home/iancu/Downloads/m3u8',
                           @Query('split') batchSize = 60,
                           @Query('delete_temp_files') deleteTempFiles = true) {
    const authToken = request.cookies.token as string;
    const job = await this.vodDownloadService.scheduleDownloadJob(id, authToken, outputPath, batchSize, deleteTempFiles).toPromise();
    Logger.debug(`Added new download job for video with ID ${job.data.vodId}`);
    const twitchVideo = await this.twitchService.getVideo(authToken, id);
    const dbVideo = await this.videosService.insertOrUpdate((user as UserCookieModel).id, twitchVideo);
    Logger.debug(`Saved video with ID ${dbVideo.id} to database.`);
    return `Download for video ${id} successfully queued.`;
  }
}
