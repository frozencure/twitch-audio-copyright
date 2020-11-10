import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import * as FfmpegCommand from 'fluent-ffmpeg';
import { VodChunkFile } from '../model/vod-chunk-file';
import { VodChunkFileType } from '../model/vod-chunk-file-type';
import { AudioConcatFile } from '../model/audio-concat-file';

@Processor('ffmpeg')
export class FfmpegProcessor {

  constructor(@InjectQueue('file-system') private readonly fileSystemQueue: Queue,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue) {
  }

  @Process({ name: 'extract-audio', concurrency: 1 })
  async extractAudioFromVideoFile(job: Job<VodChunkFile[]>): Promise<VodChunkFile[]> {
    return await Promise.all(job.data.map(videoFile => this.extractAudioFromFile(videoFile)));
  }

  @Process('audio-concat')
  async concatAudioFiles(job: Job<AudioConcatFile>) {
    return this.mergeAudioFiles(job.data);
  }

  @OnQueueCompleted({ name: 'audio-concat' })
  scheduleAudioDeletionJobs(job: Job<AudioConcatFile>): void {
    job.data.audioChunks.forEach(chunk => {
      if (chunk.shouldDeleteFile) {
        this.fileSystemQueue.add('delete-file', chunk.filePath);
      }
    });
    if (job.data.shouldDeleteFile) {
      this.fileSystemQueue.add('delete-file', job.data.fileFullPath);
    }
  }

  @OnQueueCompleted({ name: 'extract-audio' })
  async scheduleCreateAudioConcatList(job: Job<VodChunkFile[]>, result: VodChunkFile[]): Promise<Job<VodChunkFile[]>> {
    job.data.forEach(chunk => this.fileSystemQueue.add('delete-file', chunk.filePath));
    return this.fileSystemQueue.add('create-concat-list', result);
  }

  private mergeAudioFiles(audioConcantList: AudioConcatFile): Promise<AudioConcatFile> {
    let mergeCommand = FfmpegCommand();
    mergeCommand = mergeCommand.input(audioConcantList.fileFullPath)
      .inputFormat('concat')
      .inputOptions('-safe 0');
    const outFileFullPath = audioConcantList.fileFullPath.replace('.txt', '.ogg');
    mergeCommand = mergeCommand.output(outFileFullPath);
    return new Promise((resolve, reject) => {
      mergeCommand.run();
      mergeCommand.on('end', () => {
        resolve(new AudioConcatFile(outFileFullPath, audioConcantList.audioChunks, audioConcantList.shouldDeleteFile));
      }).on('error', err => {
        reject(err);
      });
    });
  }


  private extractAudioFromFile(videoChunkFile: VodChunkFile): Promise<VodChunkFile> {
    const outputPath = videoChunkFile.filePath.replace('.ts', '.ogg');
    const mergeCommand = FfmpegCommand(videoChunkFile.filePath).outputOptions('-vn').output(outputPath);
    return new Promise<VodChunkFile>((resolve, reject) => {
      mergeCommand.run();
      mergeCommand.on('end', () => {
        resolve(new VodChunkFile(outputPath, videoChunkFile.chunkNumber,
          videoChunkFile.vodId, videoChunkFile.totalNumberOfChunks, VodChunkFileType.AUDIO,
          videoChunkFile.shouldDeleteFile));
      }).on('error', err => {
        reject(err);
      });
    });
  }
}
