import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { VodDownloadService } from './vod-download-service';
import { Observable } from 'rxjs';
import { VodPlaylist } from '../model/VodPlaylist';

@Controller('/vod')
export class VodDownloadController {
  constructor(private readonly vodService: VodDownloadService) {
  }

  @Get('playlist/:id')
  getVodPlaylist(@Param('id') id, @Query('quality') quality = 'chunked'): Observable<VodPlaylist> {
    return this.vodService.getVodPlaylist(id, quality);
  }

  @Get('download/:id')
  downloadVod(@Param('id') id,
              @Query('quality') quality = '360p30',
              @Query('output') outputPath = '/home/iancu/Downloads/m3u8/',
              @Query('batch') batchSize = 50): string {
    this.vodService.downloadVod(id, quality, outputPath, batchSize)
      .subscribe(progress => {
        Logger.debug(`Download progress: ${(progress * 100).toFixed(2)}%`);
      });
    return `Vod download started`;
  }
}
