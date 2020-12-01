import { HttpModule, Module } from '@nestjs/common';
import { DownloadService } from './service/download.service';
import { DownloadController } from './download.controller';
import { BullModule } from '@nestjs/bull';
import { FfmpegProcessor } from '../ffmpeg/ffmpeg-processor';
import { DownloadProcessor } from '../io/download-processor';
import { FileSystemProcessor } from '../io/file-system-processor';
import { VodProcessCoordinator } from './service/vod-process-coordinator';
import { AuthModule } from '../auth/auth.module';
import { ClipProcessCoordinator } from './service/clip-process-coordinator';
import { DatabaseModule } from '../database/database.module';
import { ProcessingService } from './service/processing.service';
import { AcrCloudProcessingModule } from '../acr_cloud/acr-cloud-processing.module';
import { TwitchModule } from '../twitch/twitch.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  controllers: [DownloadController],
  imports: [
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5
    }),
    AuthModule,
    QueueModule,
    DatabaseModule,
    AcrCloudProcessingModule,
    TwitchModule
  ],
  providers: [DownloadService, DownloadProcessor, FfmpegProcessor,
    FileSystemProcessor, VodProcessCoordinator,
    ClipProcessCoordinator, ProcessingService]
})
export class DownloadModule {
}
