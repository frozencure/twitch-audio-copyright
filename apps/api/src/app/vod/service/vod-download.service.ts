import { HttpService, Injectable } from '@nestjs/common';
import { from, interval, Observable } from 'rxjs';
import { filter, map, mergeMap, takeWhile } from 'rxjs/operators';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { VodVideoFile } from '../model/vod-file';
import { VodDownloadDto } from '../model/vod-download-dto';

@Injectable()
export class VodDownloadService {

  constructor(private httpService: HttpService,
              @InjectQueue('download') private readonly downloadQueue: Queue) {
  }

  private getVodDownloadModel(vodId: number, authToken: string, intervalPeriod: number): Observable<VodDownloadDto> {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `OAuth ${authToken}`
    };
    const vodDownloadObs = this.httpService.get(`https://api.twitch.tv/v5/vods/${vodId}/download`, {
      headers: headersRequest
    })
      .pipe(
        map(r => r.data)
      ) as Observable<VodDownloadDto>;
    return interval(intervalPeriod).pipe(
      mergeMap(() => vodDownloadObs),
      takeWhile(vodDownload => vodDownload.download_url === '', true),
      filter(vodDownloadModel => vodDownloadModel.download_url !== '')
    );
  }

  public scheduleDownloadJob(vodId: number, authToken: string, outputPath: string,
                             chunkLength: number, deleteTempFiles = true,
                             intervalPeriod = 1000): Observable<Job<VodVideoFile>> {
    return this.getVodDownloadModel(vodId, authToken, intervalPeriod).pipe(
      mergeMap(downloadModelDto => {
          const vodDownload = new VodVideoFile(`${outputPath}/${vodId}/${vodId}.mp4`,
            vodId, chunkLength, deleteTempFiles, downloadModelDto.download_url);
          return from(this.downloadQueue.add('download-vod', vodDownload)) as Observable<Job<VodVideoFile>>;
        }
      ));
  }

}
