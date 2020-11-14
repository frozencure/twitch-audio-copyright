import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelixWrapper } from './model/HelixWrapper';
import { Video } from './model/Video';
import { Clip } from './model/Clip';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UserModel } from '../store/auth.state';
import { environment } from '../../environments/environment';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient, private store: Store) {
  }

  public getVideos(type = 'all', sort = 'time'): Observable<Array<Video>> {
    const credentials = this.getTokenAndUser();
    return this.http.get<HelixWrapper<Video>>
               (`https://api.twitch.tv/helix/videos?user_id=${ credentials.user.id }&type=${ type }&sort=${ sort }`, {
                 headers: {
                   'Authorization': `Bearer ${ credentials.token }`,
                   'Client-Id': environment.client_id
                 }
               })
               .pipe(first(), map(w => w.data.concat(w.data.concat(w.data))));
  }

  public getClips(firstString = '100'): Observable<Array<Clip>> {
    const credentials = this.getTokenAndUser();
    return this.http.get<HelixWrapper<Clip>>
               (`https://api.twitch.tv/helix/clips?broadcaster_id=${ credentials.user.id }&first=${ firstString } `, {
                 headers: {
                   'Authorization': `Bearer ${ credentials.token }`,
                   'Client-Id': environment.client_id
                 }
               })
               .pipe(first(), map(w => w.data.concat(w.data.concat(w.data))));
  }

  private getTokenAndUser(): { user: UserModel, token: string } {
    return {
      user: this.store.selectSnapshot<UserModel>((state: any) => state.auth?.user),
      token: this.store.selectSnapshot<string>((state: any) => state.auth?.token)
    };
  }
}
