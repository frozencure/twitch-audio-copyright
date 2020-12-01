import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelixWrapper } from '../../shared/model/HelixWrapper';
import { Video } from '../../shared/model/Video';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UserModel } from '../../store/auth.state';
import { environment } from '../../../environments/environment';
import { TwitchClipDto, SuccessDto } from '@twitch-audio-copyright/data';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient, private store: Store) {
  }

  public getVideos(type = 'all', sort = 'time'): Observable<Array<Video>> {
    const credentials = this.getTokenAndUser();
    return this.http.get<HelixWrapper<Video>>
    (`https://api.twitch.tv/helix/videos?user_id=${credentials.user.id}&type=${type}&sort=${sort}`, {
      headers: {
        'Authorization': `Bearer ${credentials.token}`,
        'Client-Id': environment.client_id
      }
    })
      .pipe(first(), map(w => w.data));
  }

  public getClips(firstString = '100'): Observable<Array<TwitchClipDto>> {
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
