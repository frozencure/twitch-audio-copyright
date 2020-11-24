import { Injectable } from '@nestjs/common';
import { VodDownloadService } from './vod-download.service';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { VodAudioFile, VodVideoFile } from '../model/vod-file';

@Injectable()
export class ClipProcessCoordinator {
  constructor(private readonly vodDownloadService: VodDownloadService,
              @InjectQueue('download') private readonly downloadQueue: Queue,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue,
              @InjectQueue('file-system') private readonly  fileSystemQueue) {
    this.scheduleAudioExtractionJobs();
    this.scheduleVideoDeletionJobs();
    // this.scheduleAudioDeletionJobs();
  }

  private scheduleAudioExtractionJobs(): void {
    this.downloadQueue.on('completed', (job: Job<VodVideoFile>, result: VodVideoFile) => {
      if (['download-clip'].includes(job.name)) {
        this.ffmpegQueue.add('extract-audio', result, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleVideoDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodVideoFile>) => {
      if (job.name == 'extract-audio-clip') {
        this.fileSystemQueue.add('delete-file', job.data.filePath, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleAudioDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodAudioFile>) => {
      if (job.name == 'extract-audio-clip') {
        this.fileSystemQueue.add('delete-file', job.data.filePath, {
          removeOnComplete: true
        });
      }
    });
  }

}
