import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { merge, of } from 'rxjs';
import { Video } from '../../shared/model/Video';
import { ActivatedRoute } from '@angular/router';
import { thumbnailUrl, videoCompareCresc, videoCompareDesc } from '../../utils/video.manager';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

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
  public displayedColumns: string[] = ['select', 'info', 'title', 'created_at', 'views'];
  public resultsLength = 0;
  public getThumbnailUrl = thumbnailUrl;
  selection = new SelectionModel<Video>(true, []);

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
        })).subscribe(_loading => {
      this.isLoadingResults = false;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.videos?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.videos.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Video): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
