import { AudioChunkFile } from './vod-chunk-file';
import * as path from 'path';
import * as fs from 'fs';


export class VodSegmentList {
  filePath: string;
  vodId: number;
  shouldDeleteFile: boolean;
  downloadUrl: string;


  constructor(filePath: string, vodId: number, shouldDeleteFile: boolean, downloadUrl: string) {
    this.filePath = filePath;
    this.vodId = vodId;
    this.shouldDeleteFile = shouldDeleteFile;
    this.downloadUrl = downloadUrl;
  }


  public getAudioChunks(): Promise<Array<AudioChunkFile>> {
    const dir = path.dirname(this.filePath);
    return new Promise<Array<AudioChunkFile>>((resolve, reject) => {
      fs.readFile(this.filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        const fileNames = data.split('\n').filter(filename => filename !== '');
        if(fileNames.length === 0) {
          reject(`No audio chunks could be retrieved for the given segment list: ${this.filePath}`)
        }
        resolve(fileNames.map((fileName, _, filenames) => new AudioChunkFile(
          `${dir}/${fileName}`,
          Number.parseInt(fileName.match(/\d+/g)[1]),
          this.vodId,
          filenames.length,
          this.shouldDeleteFile
        )));
      });
    });
  }
}
