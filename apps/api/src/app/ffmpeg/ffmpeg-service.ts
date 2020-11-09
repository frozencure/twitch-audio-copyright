import { Injectable, Logger } from '@nestjs/common';
import * as FfmpegCommand from 'fluent-ffmpeg';
import { forkJoin, Observable, of, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DownloadProgress } from '../vod/model/download-progress';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FfmpegService {

  public createSingleAudioFileFromBatch(downloadedFiles: Observable<DownloadProgress>,
                                        outputPath: string, deleteTempFiles = true): Observable<string> {
    const audioChunks = this.extractAudioFromBatch(downloadedFiles, deleteTempFiles);
    const audioFilesList = audioChunks.pipe(mergeMap(files => this.writeFileListForBatch(files, outputPath)));
    return zip(audioChunks, audioFilesList).pipe(audioChunksAndFileList =>
      this.mergeFiles(audioChunksAndFileList, outputPath, deleteTempFiles));
  }

  private extractAudioFromBatch(downloadedFiles: Observable<DownloadProgress>, deleteTempFiles: boolean): Observable<string[]> {
    return downloadedFiles.pipe(
      mergeMap(downloadProgress => {
        const audioFiles = new Array<Observable<string>>();
        downloadProgress.currentFileBatch.forEach(file => {
          audioFiles.push(this.extractAudioFromFile(file,
            file.replace('.ts', '.ogg'), deleteTempFiles));
        });
        return forkJoin(audioFiles);
      })
    );
  }

  private deleteFile(fileFullPath: string): void {
    if (fs.existsSync(fileFullPath)) {
      fs.unlink(fileFullPath, err => {
        if (err) {
          Logger.error(`File could not be deleted. Error: ${err}`);
        }
      });
    }
  }

  private writeFileObservable(fileFullPath: string, fileContent: string): Observable<string> {
    return new Observable<string>(subscriber => {
      fs.writeFile(fileFullPath, fileContent, err => {
        if (err) {
          subscriber.error(err);
        } else {
          subscriber.next(fileFullPath);
        }
        subscriber.complete();
      });
    });
  }

  private writeFileListForBatch(audioFiles: string[], outputPath: string): Observable<string> {
    return of(audioFiles).pipe(
      mergeMap(files => {
        const fileList = files.reduce((acc, val) => acc + `file '${val}'\n`, '');
        const listName = FfmpegService.createOutputFilename(files, 'txt');
        return this.writeFileObservable(`${outputPath}${listName}`, fileList);
      })
    );
  }

  private static createOutputFilename(audioFiles: Array<string>, extension: string): string {
    const firstChunkIndex = path.parse(audioFiles[0]).base.replace('.ogg', '');
    const lastChunkIndex = path.parse(audioFiles[audioFiles.length - 1]).base.replace('.ogg', '');
    return `${firstChunkIndex}_${lastChunkIndex}.${extension}`;
  }

  private mergeFiles(audioChunksAndFileList: Observable<[string[], string]>, outputPath: string, deleteTempFiles: boolean): Observable<string> {
    return audioChunksAndFileList.pipe(
      mergeMap(chunksAndFileList => {
          const chunks = chunksAndFileList[0];
          const fileList = chunksAndFileList[1];
          let mergeCommand = FfmpegCommand();
          mergeCommand = mergeCommand.input(fileList)
            .inputFormat('concat')
            .inputOptions('-safe 0');
          const outFileFullPath = `${outputPath}${FfmpegService.createOutputFilename(chunks, 'ogg')}`;
          mergeCommand = mergeCommand.output(outFileFullPath);
          return new Observable<string>(subscriber => {
            mergeCommand.run();
            mergeCommand.on('end', () => {
              subscriber.next(outFileFullPath);
              subscriber.complete();
              if (deleteTempFiles) {
                chunks.forEach(file => this.deleteFile(file));
                this.deleteFile(fileList);
              }
            });
          });
        }
      )
    );
  }

  private extractAudioFromFile(inputFile: string, outputFile: string, deleteInput: boolean): Observable<string> {
    const mergeCommand = FfmpegCommand(inputFile).outputOptions('-vn').output(outputFile);
    return new Observable<string>(subscriber => {
      mergeCommand.run();
      mergeCommand.on('end', () => {
        subscriber.next(outputFile);
        subscriber.complete();
        if (deleteInput) {
          this.deleteFile(inputFile);
        }
      });
    });
  }

}
