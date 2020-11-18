import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { VodDownloadService } from './service/vod-download.service';

@Controller('/vod')
export class VodDownloadController {
  constructor(private readonly vodDownloadService: VodDownloadService) {
  }

  @Get('download/:id')
  public async downloadVod(@Param('id') id,
                           @Query('token') authToken = 'ebewd22clyqimtauidzzcdhs1fuxxm',
                           @Query('output') outputPath = '/home/iancu/Downloads/m3u8',
                           @Query('split') batchSize = 60,
                           @Query('delete_temp_files') deleteTempFiles = true) {
    this.vodDownloadService.scheduleDownloadJob(id, authToken, outputPath, batchSize, deleteTempFiles).subscribe(() => {
      Logger.log('Added new download job.');
    });
  }
}
