import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelixWrapper } from '../../shared/model/HelixWrapper';
import { TwitchVideoDto } from '../../shared/model/TwitchVideoDto';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UserModel } from '../../store/auth.state';
import { environment } from '../../../environments/environment';
import {
  ClipDto,
  ProcessingProgress,
  SuccessDto,
  TwitchClipDto,
  UserActionType,
  VideoDto
} from '@twitch-audio-copyright/data';

@Injectable()
export class DashboardService {

  private clipsRefreshSubject = new BehaviorSubject(null);
  private videosRefreshSubject = new BehaviorSubject(null);

  constructor(private http: HttpClient, private store: Store) {
  }

  // TODO: replace this with package twitch
  public getTwitchVideos(type = 'all', sort = 'time'): Observable<Array<TwitchVideoDto>> {
    const credentials = this.getTokenAndUser();
    return this.http.get<HelixWrapper<TwitchVideoDto>>
    (`https://api.twitch.tv/helix/videos?user_id=${credentials.user.id}&type=${type}&sort=${sort}`, {
      headers: {
        'Authorization': `Bearer ${credentials.token}`,
        'Client-Id': environment.client_id
      }
    })
      .pipe(first(), map(w => w.data));
  }

  public getTwitchClips(firstString = '100'): Observable<Array<TwitchClipDto>> {
    const credentials = this.getTokenAndUser();
    return this.http.get<HelixWrapper<TwitchClipDto>>
    (`https://api.twitch.tv/helix/clips?broadcaster_id=${credentials.user.id}&first=${firstString} `, {
      headers: {
        'Authorization': `Bearer ${credentials.token}`,
        'Client-Id': environment.client_id
      }
    })
      .pipe(first(), map(w => w.data));
  }

  public getVideos(progress?: ProcessingProgress, userAction?: UserActionType): Observable<VideoDto[]> {
    let params = {};
    if (progress && userAction) {
      params = { progress: progress, action: userAction };
    } else if (progress) {
      params = { progress: progress };
    } else if (userAction) {
      params = { action: userAction };
    }
    return this.videosRefreshSubject.pipe(
      switchMap(() => {
        return this.http.get<VideoDto[]>('api/videos', {
          params: params
        });
      })
    );
  }

  public getClips(progress?: ProcessingProgress, userAction?: UserActionType): Observable<ClipDto[]> {
    let params = {};
    if (progress && userAction) {
      params = { progress: progress, action: userAction };
    } else if (progress) {
      params = { progress: progress };
    } else if (userAction) {
      params = { action: userAction };
    }
    return this.clipsRefreshSubject.pipe(
      switchMap(() => {
        return this.http.get<ClipDto[]>('api/clips', {
          params: params
        });
      })
    );
  }

  public refreshVideos(): void {
    this.videosRefreshSubject.next(null);
  }

  public refreshClips(): void {
    this.clipsRefreshSubject.next(null);
  }

  public processClip(clip: TwitchClipDto): Observable<SuccessDto> {
    return this.http.post<SuccessDto>('api/download/clip', clip).pipe(first());
  }

  private getTokenAndUser(): { user: UserModel, token: string } {
    return {
      user: this.store.selectSnapshot<UserModel>((state: any) => state.auth?.user),
      token: this.store.selectSnapshot<string>((state: any) => state.auth?.token)
    };
  }
}
