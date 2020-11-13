import { Process, Processor } from '@nestjs/bull';
import { VodChunk } from '../model/vod-chunk';
import { HttpService } from '@nestjs/common';
import { Job } from 'bull';
import { VideoChunkFile } from '../model/vod-chunk-file';
import * as fs from 'fs';

@Processor('download')
export class DownloadProcessor {

  constructor(private readonly httpService: HttpService) {
  }

  @Process({ name: 'download', concurrency: 1 })
  async downloadBatch(job: Job<VodChunk[]>): Promise<VideoChunkFile[]> {
    return await Promise.all(job.data.map(chunk => this.downloadFile(chunk)));
  }

  private downloadFile(vodChunk: VodChunk): Promise<VideoChunkFile> {
    return this.httpService.request({
      url: vodChunk.downloadUrl,
      method: 'GET',
      responseType: 'stream'
    }).toPromise().then(response => {
      return new Promise<VideoChunkFile>((resolve, reject) => {
        if (!fs.existsSync(vodChunk.outputPath)) {
          fs.mkdirSync(vodChunk.outputPath);
        }
        response.data.pipe(fs.createWriteStream(`${vodChunk.outputPath}/${vodChunk.fileName}`))
          .on('finish', () => {
            resolve(new VideoChunkFile(`${vodChunk.outputPath}/${vodChunk.fileName}`,
              vodChunk.chunkNumber, vodChunk.vodId, vodChunk.totalNumberOfChunks,
              vodChunk.shouldDeleteFile));
          }).on('error', err => {
          reject(err);
        });
      });
    });
  }
}
