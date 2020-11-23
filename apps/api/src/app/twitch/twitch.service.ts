import { Injectable } from '@angular/core';
import { ApiClient, HelixVideo, StaticAuthProvider } from 'twitch';

@Injectable()
export class TwitchService {

  private static readonly ClientId = process.env.CLIENT_ID;

  private initializeClient(accessToken: string): ApiClient {
    const authProvider = new StaticAuthProvider(TwitchService.ClientId, accessToken);
    return new ApiClient({ authProvider });
  }

  public async getVideo(accessToken: string, videoId: number): Promise<HelixVideo> {
    const client = this.initializeClient(accessToken);
    return await client.helix.videos.getVideoById(videoId.toString());
  }


}
