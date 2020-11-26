import { Injectable } from '@angular/core';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ClipVideoFile } from '../download/model/clip-file';
import { VodVideoFile } from '../download/model/vod-file';
import { Logger } from '@nestjs/common';
import * as path from 'path';


@Injectable()
export class DownloadQueueLogger {

  constructor(@InjectQueue('download') private readonly downloadQueue: Queue) {
    this.logCompletedJobs();
    this.logFailedJobs();
  }

  private logCompletedJobs(): void {
    this.downloadQueue.on('completed', (job: Job<unknown>, result) => {
      if (job.name === 'download-video') {
        DownloadQueueLogger.logVodDownloadComplete(result as VodVideoFile);
      }
      if (job.name === 'download-clip') {
        DownloadQueueLogger.logClipDownloadComplete(result as ClipVideoFile);
      }
    });
  }

  private logFailedJobs(): void {
    this.downloadQueue.on('failed', (job: Job<unknown>, error: Error) => {
      if (job.name === 'download-video') {
        DownloadQueueLogger.logVodDownloadFailed(job as Job<VodVideoFile>, error);
      }
      if (job.name === 'download-clip') {
        DownloadQueueLogger.logClipDownloadFailed(job as Job<ClipVideoFile>, error);
      }
    });
  }

  private static logVodDownloadComplete(result: VodVideoFile): void {
    Logger.debug(`Video ${result.vodId} successfully downloaded into ${path.basename(result.filePath)}`);
  }

  private static logVodDownloadFailed(job: Job<VodVideoFile>, error: Error): void {
    Logger.error(`Download for video ${job.data.vodId} failed. Reason: ${error}`);
  }

  private static logClipDownloadComplete(result: ClipVideoFile): void {
    Logger.debug(`Clip ${result.clipId} successfully downloaded into ${path.basename(result.filePath)}`);
  }

  private static logClipDownloadFailed(job: Job<ClipVideoFile>, error: Error): void {
    Logger.error(`Download for clip ${job.data.clipId} failed. Reason: ${error}`);
  }
}
