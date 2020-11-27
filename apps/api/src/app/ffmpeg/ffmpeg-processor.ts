import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as FfmpegCommand from 'fluent-ffmpeg';
import { VodAudioFile, VodVideoFile } from '../download/model/vod-file';
import * as path from 'path';
import { VodSegmentList } from '../download/model/vod-segment-list';
import { ClipAudioFile, ClipVideoFile } from '../download/model/clip-file';

@Processor('ffmpeg')
export class FfmpegProcessor {

  @Process({ name: 'extract-audio-vod', concurrency: 1 })
  public async extractAudioFromVideoFileProcessor(job: Job<VodVideoFile>): Promise<VodAudioFile> {
    return await this.extractAudioFromVideoFile(job);
  }

  @Process({ name: 'extract-audio-clip', concurrency: 1 })
  public async extractAudioFromClipFileProcessor(job: Job<ClipVideoFile>): Promise<ClipVideoFile> {
    return await this.extractAudioFromClipFile(job);
  }


  @Process('split-audio')
  public async splitAudioFile(job: Job<VodAudioFile>): Promise<VodSegmentList> {
    return await this.splitVodAudioFile(job);
  }

  private splitVodAudioFile(vodAudioFileJob: Job<VodAudioFile>): Promise<VodSegmentList> {
    return new Promise((resolve, reject) => {
      const mergeCommand = FfmpegCommand();
      const listFilePath = `${path.dirname(vodAudioFileJob.data.filePath)}/${vodAudioFileJob.data.vodId}.txt`;
      mergeCommand.input(vodAudioFileJob.data.filePath)
        .addOutputOption(['-f segment', `-segment_time ${vodAudioFileJob.data.chunkLengthInSeconds}`])
        .addOutputOption([`-segment_list ${listFilePath}`])
        .addOutputOption(['-c copy'])
        .output(`${path.dirname(vodAudioFileJob.data.filePath)}/${vodAudioFileJob.data.vodId}_%01d.ogg`)
        .on('progress', progress => {
          if (progress.percent % 1 == 0) {
            vodAudioFileJob.progress(progress.percent);
          }
        })
        .on('end', () => {
          resolve(new VodSegmentList(listFilePath, vodAudioFileJob.data.vodId,
            vodAudioFileJob.data.shouldDeleteFile, vodAudioFileJob.data.downloadUrl));
        }).on('error', err => {
        reject(err);
      }).run();
    });
  }

  private extractAudioFromVideoFile(job: Job<VodVideoFile>): Promise<VodAudioFile> {
    return new Promise<VodAudioFile>((resolve, reject) => {
      const outputPath = job.data.filePath.replace('.mp4', '.ogg');
      const mergeCommand = FfmpegCommand(job.data.filePath);
      mergeCommand.outputOptions('-vn').output(outputPath)
        .on('end', () => {
          resolve(new VodAudioFile(outputPath, job.data.vodId,
            job.data.chunkLengthInSeconds, job.data.shouldDeleteFile,
            job.data.downloadUrl));
        }).on('progress', progress => {
        if (progress.percent % 1 == 0) {
          job.progress(progress.percent);
        }
      }).on('error', err => {
        reject(err);
      }).run();
    });
  }

  private extractAudioFromClipFile(job: Job<ClipVideoFile>): Promise<ClipAudioFile> {
    return new Promise<ClipAudioFile>((resolve, reject) => {
      const outputPath = job.data.filePath.replace('.mp4', '.ogg');
      const mergeCommand = FfmpegCommand(job.data.filePath);
      mergeCommand.outputOptions('-vn').output(outputPath)
        .on('end', () => {
          resolve(new ClipAudioFile(outputPath, job.data.clipId,
            job.data.shouldDeleteFile,
            job.data.downloadUrl));
        }).on('progress', progress => {
        if (progress.percent % 1 == 0) {
          job.progress(progress.percent);
        }
      }).on('error', err => {
        reject(err);
      }).run();
    });
  }
}
