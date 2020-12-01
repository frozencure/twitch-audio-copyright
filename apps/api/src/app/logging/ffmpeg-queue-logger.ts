import { Injectable } from '@angular/core';
import { Job, Queue } from 'bull';
import { VodAudioFile, VodVideoFile } from '../download/model/vod-file';
import { Logger } from '@nestjs/common';
import { ClipAudioFile, ClipVideoFile } from '../download/model/clip-file';
import { VodSegmentList } from '../download/model/vod-segment-list';
import * as path from 'path';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class FfmpegQueueLogger {

  constructor(@InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue) {
    this.logCompletedJobs();
    this.logFailedJobs();
  }

  private logCompletedJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<unknown>, result) => {
      if (job.name === 'extract-audio-vod') {
        FfmpegQueueLogger.logVodAudioExtractionComplete(result as VodVideoFile);
      }
      if (job.name === 'extract-audio-clip') {
        FfmpegQueueLogger.logClipAudioExtractionComplete(result as ClipAudioFile);
      }
      if (job.name === 'split-audio') {
        FfmpegQueueLogger.logSplitAudioComplete(result as VodSegmentList);
      }
    });
  }

  private logFailedJobs(): void {
    this.ffmpegQueue.on('failed', (job: Job<unknown>, error: Error) => {
      if (job.name === 'extract-audio-vod') {
        FfmpegQueueLogger.logVodAudioExtractionFailed(job as Job<VodVideoFile>, error);
      }
      if (job.name === 'extract-audio-clip') {
        FfmpegQueueLogger.logClipAudioExtractionFailed(job as Job<ClipVideoFile>, error);
      }
      if (job.name === 'split-audio') {
        FfmpegQueueLogger.logSplitAudioFailed(job as Job<VodAudioFile>, error);
      }
    });
  }

  private static logVodAudioExtractionComplete(result: VodVideoFile): void {
    Logger.debug(`Audio extraction for video ${result.vodId} successfully extracted into` +
      ` ${path.basename(result.filePath)}`);
  }

  private static logClipAudioExtractionComplete(result: ClipAudioFile): void {
    Logger.debug(`Audio extraction for clip ${result.clipId} successfully extracted into` +
      ` ${path.basename(result.filePath)}`);
  }

  private static logSplitAudioComplete(result: VodSegmentList): void {
    Logger.debug(`Audio for video ${result.vodId} successfully split into multiple chunks.` +
      `List of chunks successfully saved into ${path.basename(result.filePath)}`);
  }

  private static logVodAudioExtractionFailed(job: Job<VodVideoFile>, error: Error): void {
    Logger.error(`Audio extraction for VOD ${job.data.vodId} failed. Reason: ${error}`);
  }

  private static logClipAudioExtractionFailed(job: Job<ClipVideoFile>, error: Error): void {
    Logger.error(`Audio extraction for VOD ${job.data.clipId} failed. Reason: ${error}`);
  }

  private static logSplitAudioFailed(job: Job<VodAudioFile>, error: Error): void {
    Logger.error(`Splitting into audion chunks for VOD ${job.data.vodId} failed. Reason: ${error}`);
  }
}
