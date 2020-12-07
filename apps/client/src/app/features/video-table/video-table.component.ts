import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TwitchVideoDto } from '../../shared/model/TwitchVideoDto';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { thumbnailUrl, videoCompareCresc, videoCompareDesc } from '../../utils/video.manager';
import { SelectionModel } from '@angular/cdk/collections';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-video-table',
  templateUrl: './video-table.component.html',
  styleUrls: ['./video-table.component.scss']
})
export class VideoTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videos: TwitchVideoDto[];
  @Output() selectedVideos: EventEmitter<TwitchVideoDto[]> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public isLoadingResults: boolean;
  public videosModel: MatTableDataSource<TwitchVideoDto>;
  public displayedColumns = ['select', 'info', 'title', 'created_at', 'views'];
  public getThumbnailUrl = thumbnailUrl;
  public selection = new SelectionModel<TwitchVideoDto>(true, []);
  private videoSortedCresc = true;
  private subscriptions = new SubSink();

  constructor() {
    this.isLoadingResults = true;
  }

  ngOnInit(): void {
    this.selection.changed.asObservable().subscribe(data => this.selectedVideos.emit(data.source.selected));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.subscriptions.sink = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      this.subscriptions.sink = merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(_ => {
            this.isLoadingResults = true;
            return of(this.videos);
          }),
          map((videoStream) => {
            this.isLoadingResults = false;
            if (this.videoSortedCresc) {
              this.videoSortedCresc = false;
              this.videosModel = new MatTableDataSource(videoStream.sort(videoCompareDesc));
            } else {
              this.videoSortedCresc = true;
              this.videosModel = new MatTableDataSource(videoStream.sort(videoCompareCresc));
            }
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return of([]);
          })).subscribe(_ => this.isLoadingResults = false);
    }, 0);
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
  checkboxLabel(row?: TwitchVideoDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
