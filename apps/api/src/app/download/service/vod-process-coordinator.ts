import { Injectable } from '@angular/core';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { DownloadService } from './download.service';
import { VodAudioFile, VodVideoFile } from '../model/vod-file';
import { VodSegmentList } from '../model/vod-segment-list';
import { Logger } from '@nestjs/common';
import { VideosService } from '../../database/video/videos.service';
import { ProcessingService } from './processing.service';
import { ProcessingProgress, UserActionType } from '@twitch-audio-copyright/data';

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
        this.videosService.updateVideo({
          id: job.data.vodId,
          progress: ProcessingProgress.IN_PROGRESS
        }).catch(err => Logger.error(err));
      }
    });
  }

  private scheduleAudioExtractionJobs(): void {
    this.downloadQueue.on('completed', (job: Job<VodVideoFile>, result: VodVideoFile) => {
      if ('download-video' === job.name) {
        this.ffmpegQueue.add('extract-audio-vod', result, {
          removeOnComplete: true
        }).catch(err => Logger.error(err));
      }
    });
  }

  private scheduleSplitAudioJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodVideoFile>, result: VodAudioFile) => {
      if (job.name == 'extract-audio-vod') {
        this.ffmpegQueue.add('split-audio', result, {
          removeOnComplete: true
        }).catch(err => Logger.error(err));
      }
    });
  }

  private scheduleVideoDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VodVideoFile>) => {
      if (job.name == 'extract-audio-vod') {
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
            this.updateVideo(result.vodId)
              .then().catch(e => Logger.error(e));
            if (result.shouldDeleteFile) {
              this.deleteAudioChunkFiles(result).then().catch(e => Logger.error(e));
              this.deleteVodSegmentList(result).then().catch(e => Logger.error(e));
            }
          });
      }
    });
  }

  private async updateVideo(vodId: number): Promise<void> {
    const hasIdentifiedSongs = await this.videosService.hasIdentifiedSongs(vodId);
    if (hasIdentifiedSongs) {
      await this.videosService.updateVideo({
        id: vodId,
        progress: ProcessingProgress.COMPLETED,
        userAction: UserActionType.NEEDS_REVIEW
      });
    } else {
      await this.videosService.updateVideo({
        id: vodId,
        progress: ProcessingProgress.COMPLETED
      });
    }
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
