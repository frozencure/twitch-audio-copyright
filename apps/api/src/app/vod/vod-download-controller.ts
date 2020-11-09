import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { VodDownloadService } from './vod-download-service';
import { Observable } from 'rxjs';
import { VodPlaylist } from './model/vod-playlist';
import { FfmpegService } from '../ffmpeg/ffmpeg-service';

@Controller('/vod')
export class VodDownloadController {
  constructor(private readonly vodService: VodDownloadService, private readonly ffmpegService: FfmpegService) {
  }

  @Get('playlist/:id')
  public getVodPlaylist(@Param('id') id, @Query('quality') quality = '360p30'): Observable<VodPlaylist> {
    return this.vodService.getVodPlaylist(id, quality);
  }

  @Get('download/:id')
  public downloadVod(@Param('id') id,
                     @Query('quality') quality = '360p30',
                     @Query('output') outputPath = '/home/iancu/Downloads/m3u8/',
                     @Query('batch_duration') batchDurationInSecs = 60): string {
    const downloadProgress = this.vodService.downloadVod(id, quality, outputPath, batchDurationInSecs);
    downloadProgress.subscribe(downloadProgress => {
      Logger.debug(`Download progress:
        ${(downloadProgress.currentCount / downloadProgress.totalCount * 100).toFixed(2)}%`);
    });
    this.ffmpegService.createSingleAudioFileFromBatch(downloadProgress, `/home/iancu/Downloads/m3u8/${id}/`).subscribe(file => {
      console.log(file);
    });
    return `Vod download started`;
  }
}
