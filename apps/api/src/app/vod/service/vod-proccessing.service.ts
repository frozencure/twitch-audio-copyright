import { HttpService, Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { VodQuality } from '../model/vod-quality';
import { VodToken } from '../model/vod-token';
import { VodChunk } from '../model/vod-chunk';
import { VodPlaylist } from '../model/vod-playlist';
import { Job, Queue } from 'bull';
import { InjectQueue, OnQueueCompleted, Processor } from '@nestjs/bull';
import { AudioConcatFile } from '../model/audio-concat-file';

@Injectable()
@Processor('ffmpeg')
export class VodProccessingService {

  constructor(private httpService: HttpService,
              @InjectQueue('download') private readonly downloadQueue: Queue) {
  }

  @OnQueueCompleted({ name: 'audio-concat' })
  private logProgress(job: Job<AudioConcatFile>) {
    const lastAudioChunk = job.data.audioChunks.reverse()[0];
    const progress = (lastAudioChunk.chunkNumber / lastAudioChunk.totalNumberOfChunks * 100).toFixed(2);
    Logger.debug(`Processing VOD ${lastAudioChunk.vodId}.
      Progress: ${progress}%`);
  }


  public scheduleDownloadJobs(vodId: number, quality: string, outputPath: string, batchSize: number, deleteTempFiles = true): Observable<Job<VodChunk[]>> {
    return this.getVodPlaylist(vodId, quality).pipe(
      mergeMap(playlist => {
        const batches = new Array<Array<VodChunk>>();
        let offset = 0;
        while (offset < playlist.vodChunks.length) {
          const limit = offset + batchSize > playlist.vodChunks.length ? playlist.vodChunks.length : offset + batchSize;
          batches.push(playlist.vodChunks.slice(offset, limit));
          offset += batchSize;
        }
        return batches;
      }),
      mergeMap(batch => {
        batch.forEach(chunk => {
          chunk.outputPath = `${outputPath}/${vodId}`;
          chunk.shouldDeleteFile = deleteTempFiles;
        });
        return from(this.downloadQueue.add('download', batch)) as Observable<Job<VodChunk[]>>;
      })
    );
  }

  public getVodPlaylist(vodId: number, quality: string): Observable<VodPlaylist> {
    return this.getVodToken(vodId).pipe(
      mergeMap(token => this.getVodQualityChannels(token, vodId)),
      mergeMap(playlist => this.getVodChunks(vodId, playlist, quality))
    );
  }

  private getVodToken(vodId: number): Observable<VodToken> {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
    };
    return this.httpService.get(`https://api.twitch.tv/api/vods/${vodId}/access_token`, {
      headers: headersRequest
    })
      .pipe(
        map(r => r.data)
      );
  }

  private getVodQualityChannels(token: VodToken, vodId: number): Observable<Array<VodQuality>> {
    const requestUrl = `http://usher.twitch.tv/vod/${vodId}` +
      `?nauth=${token.token}&nauthsig=${token.sig}&allow_source=true&player=twitchweb`;
    return this.httpService.get(requestUrl).pipe(
      map(r => {
        return this.parseVodQualityChannels(r.data);
      })
    );
  }

  private getVodChunks(vodId: number, vodQualityChannels: Array<VodQuality>, quality: string): Observable<VodPlaylist> {
    try {
      const selectedPlaylist = vodQualityChannels.filter(playlist => playlist.quality == quality)[0];

      return this.httpService.get(selectedPlaylist.downloadUrl).pipe(
        map(resp => this.parseVodChunks(vodId, selectedPlaylist.downloadUrl, resp.data))
      );
    } catch (e) {
      if (e instanceof TypeError) {
        Logger.error(`Selected quality is not available. Error: ${e}`);
      } else {
        Logger.error(e);
      }
    }

  }

  private parseVodQualityChannels(vodPlaylistResponse: string): Array<VodQuality> {
    return vodPlaylistResponse.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gm)
      .map(match => {
        const quality = match.match(/(\w+)\//gm).reverse()[0].replace('/', '');
        return new VodQuality(quality, match);
      });
  }

  private parseVodChunks(vodId: number, downloadUrl: string, vodChunksResponse: string): VodPlaylist {
    const downloadUrBase = downloadUrl.match(/(http)(.+)(\/)/gm).toString();
    const vodChunks = vodChunksResponse.match(/(#EXTINF:)(\d+.\d+)(,\n)(\d+.ts)/gm).map((match, index, arr) => {
      const duration = match.match(/\d+.\d+/);
      const file = match.match(/\d+.ts/);
      return new VodChunk(vodId, Number.parseFloat(duration.toString()), downloadUrBase + file.toString(),
        file.toString(), index, arr.length);
    });
    const vodDuration = VodProccessingService.parseVodDuration(vodChunksResponse);
    return new VodPlaylist(vodId, vodChunks, vodDuration);
  }

  private static parseVodDuration(vodChunksResponse: string): number {
    return Number.parseFloat(vodChunksResponse
      .match(/(#EXT-X-TWITCH-TOTAL-SECS):(\d+.\d+)/gm).toString()
      .match(/(\d+.\d+)/gm).toString());
  }


}
