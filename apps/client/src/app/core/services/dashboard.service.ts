import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { UserModel } from '../../store/auth.state';
import {
  Clip,
  ClipsDownloadResponseModel,
  LiveSongsResults,
  ProcessingProgress,
  TwitchClip,
  TwitchVideo,
  UserActionType,
  Video,
  VideosDownloadResponseModel
} from '@twitch-audio-copyright/data';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient, private store: Store) {
  }

  public getVideos(progress?: ProcessingProgress, userAction?: UserActionType): Observable<Video[]> {
    let params = {};
    if (progress && userAction) {
      params = { progress: progress, action: userAction };
    } else if (progress) {
      params = { progress: progress };
    } else if (userAction) {
      params = { action: userAction };
    }
    return this.http.get<Video[]>('api/videos', {
      params: params
    });
  }

  public getClips(progress?: ProcessingProgress, userAction?: UserActionType): Observable<Clip[]> {
    let params = {};
    if (progress && userAction) {
      params = { progress: progress, action: userAction };
    } else if (progress) {
      params = { progress: progress };
    } else if (userAction) {
      params = { action: userAction };
    }
    return this.http.get<Clip[]>('api/clips', {
      params: params
    });
  }

  public getLiveSongs(): Observable<LiveSongsResults> {
    return this.http.get<LiveSongsResults>('api/live/results',
      { params: { date: new Date().toISOString() } });
  }

  public downloadClips(clips: TwitchClip[]): Observable<ClipsDownloadResponseModel> {
    return this.http.post<ClipsDownloadResponseModel>('api/download/clips', {
      clips: clips
    });
  }

  public downloadVideos(videos: TwitchVideo[]): Observable<VideosDownloadResponseModel> {
    return this.http.post<VideosDownloadResponseModel>('api/download/videos', {
      videos: videos
    });
  }

  public getTokenAndUser(): { user: UserModel, token: string } {
    return {
      user: this.store.selectSnapshot<UserModel>((state: any) => state.auth?.user),
      token: this.store.selectSnapshot<string>((state: any) => state.auth?.token)
    };
  }
}
