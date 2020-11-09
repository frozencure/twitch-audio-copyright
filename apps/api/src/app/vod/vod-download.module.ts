import { HttpModule, Module } from '@nestjs/common';
import { VodDownloadService } from './vod-download-service';
import { VodDownloadController } from './vod-download-controller';
import { FfmpegService } from '../ffmpeg/ffmpeg-service';

@Module({
  controllers: [VodDownloadController],
  imports: [
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5
    })
  ],
  providers: [VodDownloadService, FfmpegService]
})
export class VodDownloadModule {
}
