import { Module } from '@nestjs/common';
import { DownloadQueueLogger } from './download-queue-logger';
import { QueueModule } from '../queue/queue.module';
import { FfmpegQueueLogger } from './ffmpeg-queue-logger';
import { FileSystemQueueLogger } from './file-system-queue-logger';

@Module({
  imports: [QueueModule],
  exports: [],
  providers: [DownloadQueueLogger, FfmpegQueueLogger, FileSystemQueueLogger]
})
export class LoggingModule {
}
