import { Process, Processor } from '@nestjs/bull';
import { HttpService } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import { VodVideoFile } from '../vod/model/vod-file';
import * as path from 'path';

@Processor('download')
export class DownloadProcessor {

  constructor(private readonly httpService: HttpService) {
  }

  @Process({ name: 'download-vod', concurrency: 1 })
  async downloadVod(job: Job<VodVideoFile>): Promise<VodVideoFile> {
    return await this.downloadFile(job);
  }

  private static createDirectoryIfNotExists(filePath: string) {
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath));
    }
  }

  private async downloadFile(job: Job<VodVideoFile>): Promise<VodVideoFile> {
    const response = await this.httpService.request({
      url: job.data.downloadUrl,
      method: 'GET',
      responseType: 'stream'
    }).toPromise();
    return new Promise<VodVideoFile>((resolve, reject) => {
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
