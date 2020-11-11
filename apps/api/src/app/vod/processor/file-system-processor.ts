import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AudioChunkFile } from '../model/vod-chunk-file';
import { AudioConcatTextList } from '../model/audio-concat-file';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from '@nestjs/common';

@Processor('file-system')
export class FileSystemProcessor {


  @Process('create-concat-list')
  async createConcatAudioList(job: Job<AudioChunkFile[]>): Promise<AudioConcatTextList> {
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

  private createAudioConcatList(audioFiles: AudioChunkFile[]): Promise<AudioConcatTextList> {
    const fileContent = audioFiles.reduce((acc, val) => acc + `file '${val.filePath}'\n`, '');
    const fileName = FileSystemProcessor.createOutputFilename(audioFiles.map(f => f.filePath), 'txt');
    const outputPath = path.dirname(audioFiles[0].filePath);
    const shouldDeleteFile = audioFiles[0].shouldDeleteFile;
    const fileFullPath = `${outputPath}/${fileName}`;
    return new Promise<AudioConcatTextList>((resolve, reject) => {
      fs.writeFile(fileFullPath, fileContent, err => {
        if (err) {
          reject(err);
        } else {
          resolve(new AudioConcatTextList(fileFullPath, audioFiles, shouldDeleteFile));
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
