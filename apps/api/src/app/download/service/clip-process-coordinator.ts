import { Injectable, Logger } from '@nestjs/common';
import { DownloadService } from './download.service';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ClipVideoFile } from '../model/clip-file';

@Injectable()
export class ClipProcessCoordinator {
  constructor(private readonly vodDownloadService: DownloadService,
              @InjectQueue('download') private readonly downloadQueue: Queue,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue,
              @InjectQueue('file-system') private readonly  fileSystemQueue) {
    this.scheduleAudioExtractionJobs();
    this.scheduleVideoDeletionJobs();
  }

  private scheduleAudioExtractionJobs(): void {
    this.downloadQueue.on('completed', (job: Job<ClipVideoFile>, result: ClipVideoFile) => {
      if (['download-clip'].includes(job.name)) {
        this.ffmpegQueue.add('extract-audio', result, {
          removeOnComplete: true
        }).catch(e => Logger.error(e));
      }
    });
  }

  private scheduleVideoDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<ClipVideoFile>) => {
      if (job.name == 'extract-audio-clip') {
        this.fileSystemQueue.add('delete-file', job.data.filePath, {
          removeOnComplete: true
        }).catch(e => Logger.error(e));
      }
    });
  }

}
