import { HttpService, Injectable, Logger } from '@nestjs/common';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as fs from 'fs';
import { VodQuality } from './model/vod-quality';
import { VodToken } from './model/vod-token';
import { VodChunk } from './model/vod-chunk';
import { VodPlaylist } from './model/vod-playlist';
import { DownloadProgress } from './model/download-progress';

@Injectable()
export class VodDownloadService {

  constructor(private httpService: HttpService) {
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

  public getVodPlaylist(vodId: number, quality: string): Observable<VodPlaylist> {
    return this.getVodToken(vodId).pipe(
      mergeMap(token => this.getVodQualityChannels(token, vodId)),
      mergeMap(playlist => this.getVodChunks(playlist, quality))
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

  public downloadVod(vodId: number, quality: string, outputPath: string, batchDuration: number): Observable<DownloadProgress> {
    const offset = { value: 0 };
    let totalCount = 0;
    const chunks = this.getChunksFromPlaylist(vodId, quality);
    chunks.subscribe(chunks => {
      totalCount = chunks.length;
    });
    const progressSubject = new BehaviorSubject<DownloadProgress>(new DownloadProgress([], 1, 0));
    const batch = this.writeChunkBatchToFiles(vodId, chunks, outputPath, batchDuration, offset);
    progressSubject.subscribe(() => {
      batch.subscribe((files) => {
        if (offset.value >= totalCount) {
          progressSubject.next(new DownloadProgress(files, totalCount, offset.value));
          progressSubject.complete();
        } else {
          progressSubject.next(new DownloadProgress(files, totalCount, offset.value));
        }
      });
    });
    return progressSubject;
  }


  private getChunksFromPlaylist(vodId: number, quality: string): Observable<VodChunk[]> {
    return this.getVodPlaylist(vodId, quality).pipe(
      map(playlist => playlist.vodChunks));
  }

  private writeChunkBatchToFiles(vodId: number, chunks: Observable<VodChunk[]>, outputPath: string,
                                 batchDurationInSecs: number, offset: { value: number }) {
    return chunks.pipe(
      map(chunks => {
        const slicedChunks = this.batchFromDuration(offset.value, chunks, batchDurationInSecs);
        offset.value += slicedChunks.length;
        return slicedChunks;
      }),
      map(chunks => {
        if (!fs.existsSync(`${outputPath}${vodId}`)) {
          fs.mkdirSync(`${outputPath}${vodId}`);
        }
        const downloadJobs = new Array<Observable<string>>();
        chunks.map(chunk => {
          downloadJobs.push(this.downloadFile(chunk.downloadUrl,
            `${outputPath}${vodId}/`, chunk.fileName));
        });
        return forkJoin(downloadJobs);
      }),
      mergeMap(files => files)
    );
  }


  private batchFromDuration(offset: number, chunks: Array<VodChunk>, duration: number): Array<VodChunk> {
    let currentDuration = 0;
    return chunks.slice(offset).filter(chunk => {
      currentDuration += chunk.duration;
      return currentDuration <= duration;
    });
  }

  private downloadFile(downloadUrl: string, outputPath: string, fileName: string): Observable<string> {
    return this.httpService.request({
      url: downloadUrl,
      method: 'GET',
      responseType: 'stream'
    }).pipe(
      mergeMap(response => {
        return new Observable(subscriber => {
          response.data.pipe(fs.createWriteStream(`${outputPath}/${fileName}`))
            .on('finish', () => {
              subscriber.next(`${outputPath}${fileName}`);
              subscriber.complete();
            });
        });
      })
    ) as Observable<string>;
  }

  private getVodChunks(vodQualityChannels: Array<VodQuality>, quality: string): Observable<VodPlaylist> {
    try {
      const selectedPlaylist = vodQualityChannels.filter(playlist => playlist.quality == quality)[0];

      return this.httpService.get(selectedPlaylist.downloadUrl).pipe(
        map(resp => this.parseVodChunks(selectedPlaylist.downloadUrl, resp.data))
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

  private parseVodChunks(downloadUrl: string, vodChunksResponse: string): VodPlaylist {
    const downloadUrBase = downloadUrl.match(/(http)(.+)(\/)/gm).toString();
    const vodChunks = vodChunksResponse.match(/(#EXTINF:)(\d+.\d+)(,\n)(\d+.ts)/gm).map(match => {
      const duration = match.match(/\d+.\d+/);
      const file = match.match(/\d+.ts/);
      return new VodChunk(Number.parseFloat(duration.toString()), downloadUrBase + file.toString(),
        file.toString());
    });
    const vodDuration = VodDownloadService.parseVodDuration(vodChunksResponse);
    return new VodPlaylist(vodChunks, vodDuration);
  }

  private static parseVodDuration(vodChunksResponse: string): number {
    return Number.parseFloat(vodChunksResponse
      .match(/(#EXT-X-TWITCH-TOTAL-SECS):(\d+.\d+)/gm).toString()
      .match(/(\d+.\d+)/gm).toString());
  }


}
