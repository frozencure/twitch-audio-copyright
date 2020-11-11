import { HttpModule, Module } from '@nestjs/common';
import { VodDownloadService } from './service/vod-download.service';
import { VodDownloadController } from './vod-download-controller';
import { BullModule } from '@nestjs/bull';
import { FfmpegProcessor } from './processor/ffmpeg-processor';
import { DownloadProcessor } from './processor/download-processor';
import { FileSystemProcessor } from './processor/file-system-processor';
import { VodProcessCoordinator } from './service/vod-process-coordinator';

@Module({
  controllers: [VodDownloadController],
  imports: [
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5
    }),
    BullModule.registerQueue({
      name: 'download'
    }, {
      name: 'ffmpeg'
    }, {
      name: 'file-system'
    })
  ],
  providers: [VodDownloadService, DownloadProcessor, FfmpegProcessor, FileSystemProcessor, VodProcessCoordinator]
})
export class VodDownloadModule {
}
