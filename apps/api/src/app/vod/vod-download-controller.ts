import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { VodProccessingService } from './service/vod-proccessing.service';
import { Observable } from 'rxjs';
import { VodPlaylist } from './model/vod-playlist';

@Controller('/vod')
export class VodDownloadController {
  constructor(private readonly vodService: VodProccessingService) {
  }

  @Get('playlist/:id')
  public getVodPlaylist(@Param('id') id, @Query('quality') quality = '360p30'): Observable<VodPlaylist> {
    return this.vodService.getVodPlaylist(id, quality);
  }

  @Get('download/:id')
  public async downloadVod(@Param('id') id,
                           @Query('quality') quality = '360p30',
                           @Query('output') outputPath = '/home/iancu/Downloads/m3u8',
                           @Query('batch_size') batchSize = 6,
                           @Query('delete_temp_files') deleteTempFiles = true) {
    this.vodService.scheduleDownloadJobs(id, quality, outputPath, batchSize, deleteTempFiles).subscribe(() => {
      Logger.log('Added new download job.');
    });

  }

}
