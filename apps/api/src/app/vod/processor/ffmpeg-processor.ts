import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as FfmpegCommand from 'fluent-ffmpeg';
import { VodAudioFile, VodVideoFile } from '../model/vod-file';
import * as path from 'path';
import { VodSegmentList } from '../model/vod-segment-list';

@Processor('ffmpeg')
export class FfmpegProcessor {

  @Process({ name: 'extract-audio', concurrency: 1 })
  async extractAudioFromVideoFile(job: Job<VodVideoFile>): Promise<VodAudioFile> {
    return await this.extractAudioFromFile(job);
  }

  @Process('split-audio')
  async splitAudioFile(job: Job<VodAudioFile>): Promise<VodSegmentList> {
    return await this.splitVodAudioFile(job);
  }

  private splitVodAudioFile(vodAudioFileJob: Job<VodAudioFile>): Promise<VodSegmentList> {
    return new Promise((resolve, reject) => {
      const mergeCommand = FfmpegCommand();
      const listFilePath = `${path.dirname(vodAudioFileJob.data.filePath)}/${vodAudioFileJob.data.vodId}.txt`;
      mergeCommand.input(vodAudioFileJob.data.filePath)
        .addOutputOption(['-f segment', `-segment_time ${vodAudioFileJob.data.chunkLength}`])
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


  private extractAudioFromFile(job: Job<VodVideoFile>): Promise<VodAudioFile> {
    return new Promise<VodAudioFile>((resolve, reject) => {
      const outputPath = job.data.filePath.replace('.mp4', '.ogg');
      const mergeCommand = FfmpegCommand(job.data.filePath);
      mergeCommand.outputOptions('-vn').output(outputPath)
        .on('end', () => {
          resolve(new VodAudioFile(outputPath, job.data.vodId,
            job.data.chunkLength, job.data.shouldDeleteFile,
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
