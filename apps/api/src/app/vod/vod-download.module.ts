import { HttpModule, Module } from '@nestjs/common';
import { VodProccessingService } from './service/vod-proccessing.service';
import { VodDownloadController } from './vod-download-controller';
import { BullModule } from '@nestjs/bull';
import { FfmpegProcessor } from './processor/ffmpeg-processor';
import { DownloadProcessor } from './processor/download-processor';
import { FileSystemProcessor } from './processor/file-system-processor';

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
  providers: [VodProccessingService, DownloadProcessor, FfmpegProcessor, FileSystemProcessor]
})
export class VodDownloadModule {
}
