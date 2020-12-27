import { Injectable } from '@angular/core';
import { ApiClient, HelixVideo, StaticAuthProvider } from 'twitch';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VodDownloadDto } from '../download/model/vod-download-dto';
import { HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class TwitchService {

  constructor(private httpService: HttpService) {
  }

  private static readonly ClientId = process.env.CLIENT_ID;

  private static createHeaders(authToken: string) {
    return {
      'Authorization': `OAuth ${authToken}`,
      'Client-ID': TwitchService.ClientId
    };
  }

  private static initializeClient(accessToken: string): ApiClient {
    const authProvider = new StaticAuthProvider(TwitchService.ClientId, accessToken);
    return new ApiClient({ authProvider });
  }

  public downloadVideo(accessToken: string, videoId: number): Observable<VodDownloadDto> {
    return this.httpService.get(`https://api.twitch.tv/v5/vods/${videoId}/download`, {
      headers: TwitchService.createHeaders(accessToken)
    }).pipe(
      map(r => r.data)
    ) as Observable<VodDownloadDto>;
  }

  public deleteVideo(accessToken: string, videoId: number): Promise<AxiosResponse<unknown>> {
    return this.httpService.delete(`https://api.twitch.tv/v5/videos/${videoId}`, {
      headers: TwitchService.createHeaders(accessToken)
    }).toPromise();
  }

  public unpublishVideo(accessToken: string, videoId: number): Promise<AxiosResponse<unknown>> {
    return this.httpService.put(`https://api.twitch.tv/v5/videos/${videoId}?viewable=private`, null, {
      headers: TwitchService.createHeaders(accessToken)
    }).toPromise();
  }

  public async getVideo(accessToken: string, videoId: number): Promise<HelixVideo> {
    const client = TwitchService.initializeClient(accessToken);
    return await client.helix.videos.getVideoById(videoId.toString());
  }

  public async getAllVideos(accessToken: string, userId: string): Promise<HelixVideo[]> {
    const client = TwitchService.initializeClient(accessToken);
    const paginatedVideos = await client.helix.videos.getVideosByUser(userId, {
      orderBy: 'time'
    });
    return paginatedVideos.data;
  }
}
