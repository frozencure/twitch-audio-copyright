import { Injectable } from '@angular/core';
import { Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { VodChunk } from '../model/vod-chunk';
import { VodDownloadService } from './vod-download.service';
import { AudioChunkFile, VideoChunkFile } from '../model/vod-chunk-file';
import { AudioConcatTextList, ConcatenatedAudioBatchFile } from '../model/audio-concat-file';

@Injectable()
export class VodProcessCoordinator {

  constructor(private readonly vodDownloadService: VodDownloadService,
              @InjectQueue('download') private readonly downloadQueue: Queue,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue,
              @InjectQueue('file-system') private readonly  fileSystemQueue) {
    this.scheduleAudioExtractionJobs();
    this.scheduleVideoDeletionJobs();
    this.scheduleCreateAudioConcatListJobs();
    this.scheduleAudioConcatJobs();
    this.scheduleAudioDeletionJobs();
    this.scheduleAudioConcatListDeletionJobs();

    this.logProgress();

  }

  private scheduleAudioExtractionJobs(): void {
    this.downloadQueue.on('completed', (job: Job<VodChunk[]>, result: VideoChunkFile[]) => {
      if (job.name == 'download') {
        this.ffmpegQueue.add('extract-audio', result, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleCreateAudioConcatListJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VideoChunkFile[]>, result: AudioChunkFile[]) => {
      if (job.name == 'extract-audio') {
        this.fileSystemQueue.add('create-concat-list', result, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleVideoDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<VideoChunkFile[]>) => {
      if (job.name == 'extract-audio') {
        job.data.filter(chunk => chunk.shouldDeleteFile)
          .forEach(chunk => this.fileSystemQueue.add('delete-file', chunk.filePath, {
            removeOnComplete: true
          }));
      }
    });
  }

  private scheduleAudioDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<AudioConcatTextList>) => {
      if (job.name == 'concat-audio') {
        job.data.audioChunks.filter(chunk => chunk.shouldDeleteFile)
          .forEach(chunk => this.fileSystemQueue.add('delete-file', chunk.filePath, {
            removeOnComplete: true
          }));
      }
    });
  }

  private scheduleAudioConcatListDeletionJobs(): void {
    this.ffmpegQueue.on('completed', (job: Job<AudioConcatTextList>) => {
      if (job.name == 'concat-audio' && job.data.shouldDeleteFile) {
        this.fileSystemQueue.add('delete-file', job.data.fileFullPath, {
          removeOnComplete: true
        });
      }
    });
  }

  private scheduleAudioConcatJobs(): void {
    this.fileSystemQueue.on('completed', (job: Job<AudioChunkFile[]>, result: AudioConcatTextList) => {
      if (job.name == 'create-concat-list') {
        this.ffmpegQueue.add('concat-audio', result, {
          removeOnComplete: true
        });
      }
    });
  }

  private logProgress() {
    this.ffmpegQueue.on('completed', (job: Job<AudioConcatTextList>, result: ConcatenatedAudioBatchFile) => {
      if (job.name == 'concat-audio') {
        const lastAudioChunk = result.audioChunks.reverse()[0];
        const progress = ((lastAudioChunk.chunkNumber + 1) / lastAudioChunk.totalNumberOfChunks * 100).toFixed(2);
        Logger.debug(`Processing VOD ${lastAudioChunk.vodId}` +
          `.Progress: ${progress}%`);
      }
    });
  }
}
