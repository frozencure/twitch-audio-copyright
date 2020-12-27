import { HttpService, Injectable, Logger } from '@nestjs/common';
import { from, interval, Observable } from 'rxjs';
import { filter, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { VodVideoFile } from '../model/vod-file';
import { VodDownloadDto } from '../model/vod-download-dto';
import { getClipUrl } from '../../utils/url.manager';
import { ClipFile } from '../model/clip-file';
import ClipEntity from '../../database/clip/clip.entity';
import { TwitchService } from '../../twitch/twitch.service';

@Injectable()
export class DownloadService {

  constructor(private httpService: HttpService,
              @InjectQueue('download') private readonly downloadQueue: Queue,
              private twitchService: TwitchService) {
  }

  public scheduleVideoDownloadJob(vodId: number, authToken: string, outputPath: string,
                                  chunkLength: number, deleteTempFiles = true,
                                  intervalPeriod = 1000): void {
    this.getVodDownloadModel(vodId, authToken, intervalPeriod).subscribe(model => {
      const vodDownload = new VodVideoFile(`${outputPath}/${vodId}/${vodId}.mp4`,
        vodId, chunkLength, deleteTempFiles, model.download_url);
      this.downloadQueue.add('download-video', vodDownload).then(() => {
        Logger.log(`Download for video ${vodId} successfully started.`);
      });
    });
  }

  public scheduleClipDownloadJob(clip: ClipEntity, authToken: string, outputPath: string,
                                 deleteTempFiles = true): Observable<Job<ClipFile>> {
    const clipDownload = new ClipFile(`${outputPath}/${clip.id}.mp4`,
      clip.id, deleteTempFiles, getClipUrl(clip.thumbnailUrl));
    return from(this.downloadQueue.add('download-clip', clipDownload)) as Observable<Job<ClipFile>>;
  }

  private getVodDownloadModel(vodId: number, authToken: string, intervalPeriod: number): Observable<VodDownloadDto> {
    const vodDownloadObs = this.twitchService.downloadVideo(authToken, vodId);
    return interval(intervalPeriod).pipe(
      mergeMap(() => vodDownloadObs),
      tap(vodDownload => Logger.debug(`Vod download url: ${vodDownload.download_url}`)),
      takeWhile(vodDownload => vodDownload.download_url === '', true),
      filter(vodDownloadModel => vodDownloadModel.download_url !== '')
    );
  }
}
