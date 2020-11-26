import { Injectable, Logger } from '@nestjs/common';
import { DownloadService } from './download.service';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ClipAudioFile, ClipVideoFile } from '../model/clip-file';
import { ProcessingService } from './processing.service';
import { ClipsService } from '../../database/clip/clips.service';
import { ProcessingProgress } from '../../database/processing-progress';

@Injectable()
export class ClipProcessCoordinator {
  constructor(private readonly vodDownloadService: DownloadService,
              @InjectQueue('download') private readonly downloadQueue: Queue,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue,
              @InjectQueue('file-system') private readonly  fileSystemQueue: Queue,
              private readonly processingService: ProcessingService,
              private readonly clipsService: ClipsService) {
    this.updateClipProgress();
    this.scheduleAudioExtractionJobs();
    this.scheduleVideoDeletionJobs();
  }

  private updateClipProgress(): void {
    this.downloadQueue.on('active', (job: Job<ClipVideoFile>) => {
      if ('download-clip' === job.name) {
        this.clipsService.updateProgress(job.data.clipId, ProcessingProgress.IN_PROGRESS)
          .then().catch(err => Logger.error(err));
      }
    });
  }

  private scheduleAudioExtractionJobs(): void {
    this.downloadQueue.on('completed', (job: Job<ClipVideoFile>, result: ClipVideoFile) => {
      if ('download-clip' === job.name) {
        this.ffmpegQueue.add('extract-audio-clip', result, {
          removeOnComplete: true
        }).catch(e => Logger.error(e));
      }
    });
  }

  private scheduleVideoDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<ClipVideoFile>, result: ClipAudioFile) => {
      if (job.name == 'extract-audio-clip') {
        if (job.data.shouldDeleteFile) {
          this.deleteVideoFile(job.data);
        }
        this.processingService.processAudioForClip(result).then(() => {
          if (result.shouldDeleteFile) {
            this.deleteAudioFile(result);
          }
          this.clipsService.updateProgress(result.clipId, ProcessingProgress.COMPLETED)
            .then().catch(e => Logger.error(e));
        }).catch(e => Logger.error(e));
      }
    });
  }

  private deleteVideoFile(videoFile: ClipVideoFile): void {
    this.fileSystemQueue.add('delete-file', videoFile.filePath, {
      removeOnComplete: true
    }).catch(e => Logger.error(e));
  }

  private deleteAudioFile(audioFile: ClipAudioFile): void {
    this.fileSystemQueue.add('delete-file', audioFile.filePath, {
      removeOnComplete: true
    }).catch(e => Logger.error(e));
  }
}
