import { Process, Processor } from '@nestjs/bull';
import { HttpService } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import { VodVideoFile } from '../download/model/vod-file';
import * as path from 'path';
import { ClipVideoFile } from '../download/model/clip-file';

@Processor('download')
export class DownloadProcessor {

  constructor(private readonly httpService: HttpService) {
  }

  private static createDirectoryIfNotExists(filePath: string) {
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath));
    }
  }

  @Process({ name: 'download-video', concurrency: 1 })
  async downloadVod(job: Job<VodVideoFile>): Promise<VodVideoFile> {
    return await this.downloadFile(job);
  }

  @Process({ name: 'download-clip', concurrency: 1 })
  async downloadClip(job: Job<ClipVideoFile>): Promise<ClipVideoFile> {
    return await this.downloadFile(job);
  }

  private async downloadFile<T extends VodVideoFile | ClipVideoFile>(job: Job<T>): Promise<T> {
    const response = await this.httpService.request({
      url: job.data.downloadUrl,
      method: 'GET',
      responseType: 'stream'
    }).toPromise();
    return new Promise<T>((resolve, reject) => {
      DownloadProcessor.createDirectoryIfNotExists(job.data.filePath);
      const totalBytes = response.headers['content-length'];
      let receivedBytes = 0;
      response.data.on('data', chunk => {
        receivedBytes += chunk.length;
        const prog = (receivedBytes / totalBytes) * 100;
        if (prog % 1 == 0) {
          job.progress(prog.toFixed());
        }
      }).pipe(fs.createWriteStream(job.data.filePath))
        .on('finish', () => {
          resolve(job.data);
        }).on('error', err => {
        fs.unlinkSync(job.data.filePath);
        reject(err);
      });
    });
  }
}
