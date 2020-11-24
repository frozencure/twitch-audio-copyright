import { Injectable } from '@angular/core';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { DownloadService } from './download.service';
import { VodAudioFile, VodVideoFile } from '../model/vod-file';
import { VodSegmentList } from '../model/vod-segment-list';
import { Logger } from '@nestjs/common';

@Injectable()
export class VodProcessCoordinator {

  constructor(private readonly vodDownloadService: DownloadService,
              @InjectQueue('download') private readonly downloadQueue: Queue,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue,
              @InjectQueue('file-system') private readonly  fileSystemQueue) {
    this.scheduleAudioExtractionJobs();
    this.scheduleVideoDeletionJobs();
    this.scheduleSplitAudioJobs();
    this.scheduleAudioDeletionJobs();

    this.logProgress();
  }

  private scheduleAudioExtractionJobs(): void {
    this.downloadQueue.on('completed', (job: Job<VodVideoFile>, result: VodVideoFile) => {
      if ('download-vod' === job.name) {
        this.ffmpegQueue.add('extract-audio', result, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleSplitAudioJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodVideoFile>, result: VodAudioFile) => {
      if (job.name == 'extract-audio') {
        this.ffmpegQueue.add('split-audio', result, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleVideoDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodVideoFile>) => {
      if (job.name == 'extract-audio') {
        this.fileSystemQueue.add('delete-file', job.data.filePath, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleAudioDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodAudioFile>) => {
      if (job.name == 'split-audio') {
        this.fileSystemQueue.add('delete-file', job.data.filePath, {
          removeOnComplete: true
        });
      }
    });
  }

  private logProgress() {
    this.ffmpegQueue.on('completed', (job: Job<VodAudioFile>, result: VodSegmentList) => {
      if (job.name == 'split-audio') {
        const audioChunks = result.getAudioChunks();
        audioChunks.then(chunks => {
          chunks.forEach(chunk => Logger.debug(`Created ${chunk.filePath}`));
        });
      }
    });
  }
}
