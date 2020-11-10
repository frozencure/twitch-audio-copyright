import { InjectQueue, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { VodChunk } from '../model/vod-chunk';
import { HttpService } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { VodChunkFile } from '../model/vod-chunk-file';
import * as fs from 'fs';
import { VodChunkFileType } from '../model/vod-chunk-file-type';

@Processor('download')
export class DownloadProcessor {

  constructor(private readonly httpService: HttpService,
              @InjectQueue('ffmpeg') private readonly ffmpegQueue: Queue) {
  }

  @Process({ name: 'download', concurrency: 1 })
  async downloadBatch(job: Job<VodChunk[]>): Promise<VodChunkFile[]> {
    return await Promise.all(job.data.map(chunk => this.downloadFile(chunk)));
  }


  @OnQueueCompleted({ name: 'download' })
  private async scheduleAudioExtractionJob(_: Job, result: VodChunkFile[]): Promise<Job<VodChunkFile[]>> {
    return await this.ffmpegQueue.add('extract-audio', result);
  }


  private downloadFile(vodChunk: VodChunk): Promise<VodChunkFile> {
    return this.httpService.request({
      url: vodChunk.downloadUrl,
      method: 'GET',
      responseType: 'stream'
    }).toPromise().then(response => {
      return new Promise<VodChunkFile>((resolve, reject) => {
        if(!fs.existsSync(vodChunk.outputPath)) {
          fs.mkdirSync(vodChunk.outputPath);
        }
        response.data.pipe(fs.createWriteStream(`${vodChunk.outputPath}/${vodChunk.fileName}`))
          .on('finish', () => {
            resolve(new VodChunkFile(`${vodChunk.outputPath}/${vodChunk.fileName}`,
              vodChunk.chunkNumber, vodChunk.vodId, vodChunk.totalNumberOfChunks, VodChunkFileType.VIDEO,
              vodChunk.shouldDeleteFile));
          }).on('error', err => {
          reject(err);
        });
      });
    });
  }
}
