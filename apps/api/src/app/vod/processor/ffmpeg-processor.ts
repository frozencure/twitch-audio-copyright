import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as FfmpegCommand from 'fluent-ffmpeg';
import { AudioChunkFile, VideoChunkFile } from '../model/vod-chunk-file';
import { AudioConcatTextList, ConcatenatedAudioBatchFile } from '../model/audio-concat-file';

@Processor('ffmpeg')
export class FfmpegProcessor {

  @Process({ name: 'extract-audio', concurrency: 1 })
  async extractAudioFromVideoFile(job: Job<VideoChunkFile[]>): Promise<AudioChunkFile[]> {
    return await Promise.all(job.data.map(videoFile => this.extractAudioFromFile(videoFile)));
  }

  @Process('concat-audio')
  async concatAudioFiles(job: Job<AudioConcatTextList>): Promise<ConcatenatedAudioBatchFile> {
    return this.mergeAudioFiles(job.data);
  }

  private mergeAudioFiles(audioConcantList: AudioConcatTextList): Promise<ConcatenatedAudioBatchFile> {
    let mergeCommand = FfmpegCommand();
    mergeCommand = mergeCommand.input(audioConcantList.fileFullPath)
      .inputFormat('concat')
      .inputOptions('-safe 0');
    const outFileFullPath = audioConcantList.fileFullPath.replace('.txt', '.ogg');
    mergeCommand = mergeCommand.output(outFileFullPath);
    return new Promise((resolve, reject) => {
      mergeCommand.run();
      mergeCommand.on('end', () => {
        resolve(new ConcatenatedAudioBatchFile(outFileFullPath, audioConcantList.audioChunks, audioConcantList.shouldDeleteFile));
      }).on('error', err => {
        reject(err);
      });
    });
  }


  private extractAudioFromFile(videoChunkFile: VideoChunkFile): Promise<AudioChunkFile> {
    const outputPath = videoChunkFile.filePath.replace('.ts', '.ogg');
    const mergeCommand = FfmpegCommand(videoChunkFile.filePath).outputOptions('-vn').output(outputPath);
    return new Promise<AudioChunkFile>((resolve, reject) => {
      mergeCommand.run();
      mergeCommand.on('end', () => {
        resolve(new AudioChunkFile(outputPath, videoChunkFile.chunkNumber,
          videoChunkFile.vodId, videoChunkFile.totalNumberOfChunks,
          videoChunkFile.shouldDeleteFile));
      }).on('error', err => {
        reject(err);
      });
    });
  }
}
