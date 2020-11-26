import { Injectable } from '@angular/core';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { DownloadService } from './download.service';
import { VodAudioFile, VodVideoFile } from '../model/vod-file';
import { VodSegmentList } from '../model/vod-segment-list';
import { Logger } from '@nestjs/common';
import { VideosService } from '../../database/video/videos.service';
import { VideoProgress } from '../../database/video/video.entity';
import { ProcessingService } from './processing.service';

@Injectable()
export class VodProcessCoordinator {

  constructor(private readonly vodDownloadService: DownloadService,
              @InjectQueue('download') private readonly downloadQueue: Queue,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue,
              @InjectQueue('file-system') private readonly  fileSystemQueue,
              private readonly videosService: VideosService,
              private readonly processingService: ProcessingService) {
    this.scheduleAudioExtractionJobs();
    this.scheduleVideoDeletionJobs();
    this.scheduleSplitAudioJobs();
    this.scheduleAudioDeletionJobs();
    this.updateVideoProgress();
    this.processAudioChunks();
  }

  private updateVideoProgress(): void {
    this.downloadQueue.on('active', (job: Job<VodVideoFile>) => {
      if ('download-video' === job.name) {
        this.videosService.updateVideoProgress(job.data.vodId, VideoProgress.IN_PROGRESS)
          .catch(err => Logger.error(err));
      }
    });
  }


  private scheduleAudioExtractionJobs(): void {
    this.downloadQueue.on('completed', (job: Job<VodVideoFile>, result: VodVideoFile) => {
      if ('download-video' === job.name) {
        this.ffmpegQueue.add('extract-audio', result, {
          removeOnComplete: true
        }).catch(err => Logger.error(err));
      }
    });
  }

  private scheduleSplitAudioJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodVideoFile>, result: VodAudioFile) => {
      if (job.name == 'extract-audio') {
        this.ffmpegQueue.add('split-audio', result, {
          removeOnComplete: true
        }).catch(err => Logger.error(err));
      }
    });
  }

  private scheduleVideoDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodVideoFile>) => {
      if (job.name == 'extract-audio') {
        this.fileSystemQueue.add('delete-file', job.data.filePath, {
          removeOnComplete: true
        }).catch(err => Logger.error(err));
      }
    });
  }

  private scheduleAudioDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodAudioFile>) => {
      if (job.name == 'split-audio') {
        this.fileSystemQueue.add('delete-file', job.data.filePath, {
          removeOnComplete: true
        }).catch(err => Logger.error(err));

      }
    });
  }

  private processAudioChunks(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodAudioFile>, result: VodSegmentList) => {
      if (job.name == 'split-audio') {
        this.processingService.processAudioChunksForVideo(job.data, result)
          .then(() => {
            Logger.debug(`VOD with ID ${result.vodId} successfully processed.`);
            this.videosService.updateVideoProgress(result.vodId, VideoProgress.COMPLETED)
              .then().catch(e => Logger.error(e));
            if (result.shouldDeleteFile) {
              this.deleteAudioChunkFiles(result).then().catch(e => Logger.error(e));
              this.deleteVodSegmentList(result).then().catch(e => Logger.error(e));
            }
          });
      }
    });
  }

  private async deleteAudioChunkFiles(vodSegmentList: VodSegmentList): Promise<void> {
    const chunks = await vodSegmentList.getAudioChunks()
      .catch(e => Logger.error(e));
    if (chunks) {
      chunks.forEach(chunk => {
        this.fileSystemQueue.add('delete-file', chunk.filePath, {
          removeOnComplete: true
        }).catch(err => Logger.error(err));
      });
    }
  }

  private async deleteVodSegmentList(vodSegmentList: VodSegmentList): Promise<void> {
    this.fileSystemQueue.add('delete-file', vodSegmentList.filePath, {
      removeOnComplete: true
    }).catch(err => Logger.error(err));
  }

}
