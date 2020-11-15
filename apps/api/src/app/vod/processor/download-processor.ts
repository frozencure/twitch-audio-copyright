import { Process, Processor } from '@nestjs/bull';
import { HttpService } from '@nestjs/common';
import { Job } from 'bull';
import * as fs from 'fs';
import { VodVideoFile } from '../model/vod-file';
import * as path from 'path';

@Processor('download')
export class DownloadProcessor {

  constructor(private readonly httpService: HttpService) {
  }

  @Process({ name: 'download-vod', concurrency: 1 })
  async downloadVod(job: Job<VodVideoFile>): Promise<VodVideoFile> {
    return await this.downloadFile(job);
  }

  private downloadFile(job: Job<VodVideoFile>): Promise<VodVideoFile> {
    return this.httpService.request({
      url: job.data.downloadUrl,
      method: 'GET',
      responseType: 'stream'
    }).toPromise().then(response => {
      return new Promise<VodVideoFile>((resolve, reject) => {
        if (!fs.existsSync(path.dirname(job.data.filePath))) {
          fs.mkdirSync(path.dirname(job.data.filePath));
        }
        const totalBytes = response.headers['content-length'];
        let receivedBytes = 0;
        response.data.on('data', chunk => {
          receivedBytes += chunk.length;
          const prog = (receivedBytes/totalBytes) * 100;
          if(prog % 1 == 0) {
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
    });
  }
}
