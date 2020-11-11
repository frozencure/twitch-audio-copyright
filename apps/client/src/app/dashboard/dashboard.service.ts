import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelixWrapper } from './model/HelixWrapper';
import { Video } from './model/Video';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { UserModel } from '../store/auth.state';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient, private store: Store) {
  }

  public getVideos(type = 'all', sort = 'time'): Observable<Array<Video>> {

    const user = this.store.selectSnapshot<UserModel>((state: any) => state.auth?.user);
    const token = this.store.selectSnapshot<UserModel>((state: any) => state.auth?.token);
    return this.http.get<HelixWrapper<Video>>
               (`https://api.twitch.tv/helix/videos?user_id=${ user.id }&type=${ type }&sort=${ sort }`, {
                 headers: {
                   'Authorization': `Bearer ${ token }`,
                   'Client-Id': '2nbrngul34u21ei0lqq3hxv7w9iyix'
                 }
               })
               .pipe(first(), map(w => w.data));
  }
}
