import { Injectable } from '@angular/core';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';

@Injectable()
export class FileSystemQueueLogger {

  constructor(@InjectQueue('file-system') private readonly fileSystemQueue: Queue) {
    this.logCompletedJobs();
    this.logFailedJobs();
  }

  private logCompletedJobs(): void {
    this.fileSystemQueue.on('completed', (job: Job<string>) => {
      if(job.name === 'delete-file') {
        FileSystemQueueLogger.logFileDeletionComplete(job);
      }
    });
  }

  private logFailedJobs(): void {
    this.fileSystemQueue.on('failed', (job: Job<string>, error: Error) => {
      if(job.name === 'delete-file') {
        FileSystemQueueLogger.logFileDeletionFailed(job, error);
      }
    });
  }

  private static logFileDeletionComplete(job: Job<string>): void {
    Logger.debug(`File ${job.data} successfully removed.`);
  }

  private static logFileDeletionFailed(job: Job<string>, error: Error): void {
    Logger.error(`File ${job.data} could not be deleted. Reason: ${error}`);
  }
}
