import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as fs from 'fs';
import { VodQuality } from '../model/VodQuality';
import { VodToken } from '../model/VodToken';
import { VodChunk } from '../model/VodChunk';
import { VodPlaylist } from '../model/VodPlaylist';

@Injectable()
export class VodDownloadService {

  private count = 0;

  constructor(private httpService: HttpService) {
  }

  getData(): { message: string } {
    return { message: 'Welcome to vod downloads!' };
  }

  private getVodToken(vodId: number): Observable<VodToken> {
    const headersRequest = {
      'Content-Type': 'application/json', // afaik this one is not needed
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

  public downloadVod(vodId: number, quality: string, outputPath: string): Observable<number> {
    return this.getVodPlaylist(vodId, quality).pipe(
      map(playlist => playlist.vodChunks),
      mergeMap(chunks => {
        if (!fs.existsSync(`${outputPath}${vodId}`)) {
          fs.mkdirSync(`${outputPath}${vodId}`);
        }
        return new Observable<Observable<number>>(subscriber => {
          chunks.map((chunk, index) => {
            subscriber.next(this.downloadFile(chunk.downloadUrl, `${outputPath}${vodId}`, `${index}.ts`, chunks.length - 1));
          });
        });
      }),
      mergeMap(o => o)
    );
  }

  private downloadFile(downloadUrl: string, outputPath: string, fileName: string, progress: number): Observable<number> {
    return this.httpService.request({
      url: downloadUrl,
      method: 'GET',
      responseType: 'stream'
    }).pipe(
      mergeMap(response => {
        return new Observable(subscriber => {
          response.data.pipe(fs.createWriteStream(`${outputPath}/${fileName}`))
            .on('finish', () => {
              subscriber.next(progress);
            });
        });
      })
    ) as Observable<number>;
  }

  private getVodChunks(vodQualityChannels: Array<VodQuality>, quality: string): Observable<VodPlaylist> {
    const selectedPlaylist = vodQualityChannels.filter(playlist => playlist.quality == quality)[0];
    return this.httpService.get(selectedPlaylist.downloadUrl).pipe(
      map(resp => this.parseVodChunks(selectedPlaylist.downloadUrl, resp.data))
    );
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
      return new VodChunk(Number.parseFloat(duration.toString()), downloadUrBase + file.toString());
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
