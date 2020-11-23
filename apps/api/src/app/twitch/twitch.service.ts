import { Injectable } from '@angular/core';
import { ApiClient, StaticAuthProvider } from 'twitch';

@Injectable()
export class TwitchService {

    private static readonly ClientId = process.env.CLIENT_ID

    private initializeClient(accessToken: string): ApiClient {
      const authProvider = new StaticAuthProvider(TwitchService.ClientId, accessToken);
      return new ApiClient({authProvider});
    }





}
