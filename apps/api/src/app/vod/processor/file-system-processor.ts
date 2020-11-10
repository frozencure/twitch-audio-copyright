import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { VodChunkFile } from '../model/vod-chunk-file';
import { AudioConcatFile } from '../model/audio-concat-file';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

@Processor('file-system')
export class FileSystemProcessor {


  constructor(@InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue) {
  }

  @Process('create-concat-list')
  async createConcatAudioList(job: Job<VodChunkFile[]>): Promise<AudioConcatFile> {
    return await this.createAudioConcatList(job.data);
  }

  @Process('delete-file')
  deleteFile(job: Job<string>): void {
    if (fs.existsSync(job.data)) {
      fs.unlink(job.data, err => {
        if (err) {
          Logger.error(`File could not be deleted. Error: ${err}`);
        }
      });
    }
  }

  @OnQueueCompleted({ name: 'create-concat-list' })
  async scheduleAudioFilesConcat(_: Job, result: AudioConcatFile): Promise<Job<AudioConcatFile>> {
    return this.ffmpegQueue.add('audio-concat', result);
  }

  private createAudioConcatList(audioFiles: VodChunkFile[]): Promise<AudioConcatFile> {
    const fileContent = audioFiles.reduce((acc, val) => acc + `file '${val.filePath}'\n`, '');
    const fileName = FileSystemProcessor.createOutputFilename(audioFiles.map(f => f.filePath), 'txt');
    const outputPath = path.dirname(audioFiles[0].filePath);
    const shouldDeleteFile = audioFiles[0].shouldDeleteFile;
    const fileFullPath = `${outputPath}/${fileName}`;
    return new Promise<AudioConcatFile>((resolve, reject) => {
      fs.writeFile(fileFullPath, fileContent, err => {
        if (err) {
          reject(err);
        } else {
          resolve(new AudioConcatFile(fileFullPath, audioFiles, shouldDeleteFile));
        }
      });
    });
  }

  private static createOutputFilename(audioFiles: Array<string>, extension: string): string {
    const firstChunkIndex = path.parse(audioFiles[0]).base.replace('.ogg', '');
    const lastChunkIndex = path.parse(audioFiles[audioFiles.length - 1]).base.replace('.ogg', '');
    return `${firstChunkIndex}_${lastChunkIndex}.${extension}`;
  }


}
