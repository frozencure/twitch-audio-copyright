import { HttpService, Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { VodQuality } from '../model/vod-quality';
import { VodToken } from '../model/vod-token';
import { VodChunk } from '../model/vod-chunk';
import { VodPlaylist } from '../model/vod-playlist';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { VodDownloadModel } from '../model/vod-download-model';

@Injectable()
export class VodDownloadService {

  constructor(private httpService: HttpService,
              @InjectQueue('download') private readonly downloadQueue: Queue) {
  }

  private getVodDownloadModel(vodId: number, authToken: string): Observable<VodDownloadModel> {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `OAuth ${authToken}`
    };
    return this.httpService.get(`https://api.twitch.tv/v5/vods/${vodId}/download`, {
      headers: headersRequest
    })
      .pipe(
        map(r => r.data)
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
    const vodDuration = VodDownloadService.parseVodDuration(vodChunksResponse);
    return new VodPlaylist(vodId, vodChunks, vodDuration);
  }

  private static parseVodDuration(vodChunksResponse: string): number {
    return Number.parseFloat(vodChunksResponse
      .match(/(#EXT-X-TWITCH-TOTAL-SECS):(\d+.\d+)/gm).toString()
      .match(/(\d+.\d+)/gm).toString());
  }


}
