import { Controller, Get, Param, Query } from '@nestjs/common';
import { VodDownloadService } from './VodDownloadService';
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
              @Query('quality') quality = 'chunked',
              @Query('outputPath') outputPath = '/home/iancu/Downloads/m3u8/'): string {
    let count = 0;
    this.vodService.downloadVod(id, quality, outputPath).subscribe(d => {
      console.log(count/d);
      count += 1;
    });
    return `Vod download started`;
  }


}
