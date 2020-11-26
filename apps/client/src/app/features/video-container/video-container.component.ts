import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { merge, of } from 'rxjs';
import { Video } from '../../shared/model/Video';
import { ActivatedRoute } from '@angular/router';
import { thumbnailUrl, videoCompareCresc, videoCompareDesc } from '../../utils/video.manager';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, map, mergeMap, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.scss']
})
export class VideoContainerComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public videos: Video[];
  public type: string;
  public isLoadingResults: boolean;
  public displayedColumns: string[] = ['info', 'title', 'created_at', 'views'];
  public resultsLength = 0;
  public getThumbnailUrl = thumbnailUrl;
  private videoSoretedCresc = false;

  constructor(private actRoute: ActivatedRoute) {
    this.isLoadingResults = true;
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(_ => {
          this.isLoadingResults = true;
          return this.actRoute.data;
        }),
        mergeMap(data => {
          this.type = data.routeResolver.type;
          return data.routeResolver.stream;
        }),
        map((streams: any[]) => {
          console.log(streams);
          this.isLoadingResults = false;
          if (this.videoSoretedCresc) {
            this.videoSoretedCresc = false;
            this.videos = streams.sort(videoCompareDesc);
          } else {
            this.videoSoretedCresc = true;
            this.videos = streams.sort(videoCompareCresc);
          }
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })).subscribe(_loading => this.isLoadingResults = false);
  }

}
