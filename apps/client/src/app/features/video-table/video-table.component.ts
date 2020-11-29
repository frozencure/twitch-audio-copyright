import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Video } from '../../shared/model/Video';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { thumbnailUrl, videoCompareCresc, videoCompareDesc } from '../../utils/video.manager';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-video-table',
  templateUrl: './video-table.component.html',
  styleUrls: ['./video-table.component.scss']
})
export class VideoTableComponent implements OnInit, AfterViewInit {
  @Input() videos$: Observable<Video[]>;
  @Output() selectedVideos: EventEmitter<Video[]> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public type: string;
  public isLoadingResults: boolean;
  public displayedColumns: string[] = ['select', 'info', 'title', 'created_at', 'views'];
  public getThumbnailUrl = thumbnailUrl;
  public videos: Video[] = [];
  public selection = new SelectionModel<Video>(true, []);
  private videoSortedCresc = false;

  constructor() {
    this.isLoadingResults = true;
  }

  ngOnInit(): void {
    this.selection.changed.asObservable().subscribe(data => this.selectedVideos.emit(data.source.selected));
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(_ => {
          this.isLoadingResults = true;
          return this.videos$;
        }),
        map((videoStream: Video[]) => {
          this.isLoadingResults = false;
          if (this.videoSortedCresc) {
            this.videoSortedCresc = false;
            this.videos = videoStream.sort(videoCompareDesc);
          } else {
            this.videoSortedCresc = true;
            this.videos = videoStream.sort(videoCompareCresc);
          }
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return of([]);
        })).subscribe(_ => this.isLoadingResults = false);
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
      this.selection.select(...this.videos);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Video): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
