import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { videoThumbnailUrl } from '../../utils/video.manager';
import { SelectionModel } from '@angular/cdk/collections';
import { SubSink } from 'subsink';
import { MatTableDataSource } from '@angular/material/table';
import { HelixVideo } from 'twitch';

@Component({
  selector: 'app-video-table',
  templateUrl: './video-table.component.html',
  styleUrls: ['./video-table.component.scss', './../dashboard/dashboard.component.scss']
})
export class VideoTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videos: HelixVideo[];
  @Output() selectedVideos: EventEmitter<HelixVideo[]> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public isLoadingResults: boolean;
  public dataSource: MatTableDataSource<HelixVideo>;
  public displayedColumns = ['select', 'info', 'created_at', 'views', 'duration'];
  public getThumbnailUrl = videoThumbnailUrl;
  public selection = new SelectionModel<HelixVideo>(true, []);
  private subscriptions = new SubSink();

  constructor() {
    this.isLoadingResults = true;
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.selection.changed.asObservable()
      .subscribe(data => this.selectedVideos.emit(data.source.selected));
    this.dataSource = new MatTableDataSource<HelixVideo>(this.videos);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'created_at':
          return item.publishDate;
        case 'views':
          return item.views;
        case 'duration':
          return item.durationInSeconds;
        default:
          return item[property];
      }
    };
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
  checkboxLabel(row?: HelixVideo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
