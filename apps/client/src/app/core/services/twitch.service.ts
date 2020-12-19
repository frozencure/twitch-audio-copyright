import { ApiClient, HelixClip, HelixPaginatedResult, HelixVideo, StaticAuthProvider } from 'twitch';
import { HelixGame } from 'twitch/lib/API/Helix/Game/HelixGame';
import { environment } from '../../../environments/environment';
import { DashboardService } from './dashboard.service';
import { Injectable } from '@angular/core';


@Injectable()
export class TwitchService {

  constructor(private readonly dashboardService: DashboardService) {
  }

  private static readonly ClientId = environment.client_id;
  private userId = this.dashboardService.getTokenAndUser().user.id;

  private initializeClient(): ApiClient {
    const authProvider = new StaticAuthProvider(TwitchService.ClientId,
      this.dashboardService.getTokenAndUser().token);
    return new ApiClient({ authProvider });
  }

  public async getClips(): Promise<HelixClip[]> {
    const client = this.initializeClient();
    const clips = await client.helix.clips.getClipsForBroadcaster(this.userId, {
      limit: 100
    });
    return clips.data;
  }

  public getGames(gameIds: string[]): Promise<HelixGame[]> {
    const client = this.initializeClient();
    return client.helix.games.getGamesByIds(gameIds);
  }

  public async getVideos(): Promise<HelixVideo[]> {
    const client = this.initializeClient();
    const paginated = await client.helix.videos.getVideosByUserPaginated(this.userId, {
      orderBy: 'time',
    });
    return paginated.getAll();
  }
}
