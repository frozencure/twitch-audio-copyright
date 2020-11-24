import { HttpModule, Module } from '@nestjs/common';
import { DownloadService } from './service/download.service';
import { VodDownloadController } from './vod-download.controller';
import { BullModule } from '@nestjs/bull';
import { FfmpegProcessor } from '../ffmpeg/ffmpeg-processor';
import { DownloadProcessor } from '../io/download-processor';
import { FileSystemProcessor } from '../io/file-system-processor';
import { VodProcessCoordinator } from './service/vod-process-coordinator';
import { AuthModule } from '../auth/auth.module';
import { ClipProcessCoordinator } from './service/clip-process-coordinator';

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
    }),
    AuthModule
  ],
  providers: [DownloadService, DownloadProcessor, FfmpegProcessor, FileSystemProcessor, VodProcessCoordinator, ClipProcessCoordinator]
})
export class VodDownloadModule {
}
