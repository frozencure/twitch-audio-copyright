import { Body, Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { VodDownloadService } from './service/vod-download.service';
import { ClipDto, SuccessDto } from '@twitch-audio-copyright/data';
import { TokenGuard } from '../auth/token-guard.service';
import { Token } from '../utils/decorators';

@Controller('/download')
export class VodDownloadController {
  constructor(private readonly vodDownloadService: VodDownloadService) {
  }

  // TODO: put the token decorator
  @Get('video/:id')
  public async downloadVod(@Param('id') id,
                           @Query('token') authToken = 'ebewd22clyqimtauidzzcdhs1fuxxm',
                           @Query('output') outputPath = '/home/iancu/Downloads/m3u8',
                           @Query('split') batchSize = 60,
                           @Query('delete_temp_files') deleteTempFiles = true): Promise<SuccessDto> {
    this.vodDownloadService.scheduleDownloadJob(id, authToken, outputPath, batchSize, deleteTempFiles).subscribe(() => {
      Logger.log('Added new download job.');
    });
    return new SuccessDto('DOWNLOAD_STARTED');
  }

  // TODO: put the token decorator
  @Post('/clip')
  @UseGuards(TokenGuard)
  public async downloadClip(@Token() token: string,
                            @Body() clip: ClipDto,
                            @Query('output') outputPath = '/Users/andyradulescu/Desktop/twitchDownlaods',
                            @Query('split') batchSize = 60,
                            @Query('delete_temp_files') deleteTempFiles = true): Promise<SuccessDto> {

    this.vodDownloadService.scheduleClipDownloadJob(clip,
      token, outputPath, batchSize, deleteTempFiles).subscribe(() => {
      Logger.log('Added new download job.');
    });
    return new SuccessDto('DOWNLOAD_STARTED');

  }

}
