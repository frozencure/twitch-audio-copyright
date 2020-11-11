import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelixWrapper } from './model/HelixWrapper';
import { Video } from './model/Video';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {
  }

  public getVideos(userId: number, type = 'all', sort = 'time'): Observable<Array<Video>> {
    return this.http.get<HelixWrapper<Video>>
               (`https://api.twitch.tv/helix/videos?user_id=${ userId }&type=${ type }&sort=${ sort }`)
               .pipe(first(), map(w => w.data));
  }
}
