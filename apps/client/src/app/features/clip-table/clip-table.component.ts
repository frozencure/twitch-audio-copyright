import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TwitchClipDto } from '@twitch-audio-copyright/data';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { SubSink } from 'subsink';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { videoThumbnailUrl } from '../../utils/video.manager';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-clip-table',
  templateUrl: './clip-table.component.html',
  styleUrls: ['./clip-table.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipTableComponent implements OnInit, AfterViewInit {

  @Input() clips: TwitchClipDto[];
  @Output() selectedClips: EventEmitter<TwitchClipDto[]> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public isLoadingResults: boolean;
  public clipsModel: MatTableDataSource<TwitchClipDto>;
  public displayedColumns = ['select', 'info', 'created_at', 'views'];
  public selection = new SelectionModel<TwitchClipDto>(true, []);
  public getThumbnailUrl = videoThumbnailUrl;
  private clipsSortedAscending = true;
  private subscriptions = new SubSink();

  constructor() {
    this.isLoadingResults = true;
  }

  ngOnInit(): void {
    this.selection.changed.asObservable().subscribe(data => this.selectedClips.emit(data.source.selected));
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.subscriptions.sink = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      this.subscriptions.sink = merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return of(this.clips);
          }),
          map((clipsStream) => {
            this.isLoadingResults = false;
            if (this.clipsSortedAscending) {
              this.clipsSortedAscending = false;
              this.clipsModel = new MatTableDataSource(clipsStream);
            } else {
              this.clipsSortedAscending = true;
              this.clipsModel = new MatTableDataSource(clipsStream);
            }
          }),
          catchError(() => {
            this.isLoadingResults = false;
            return of([]);
          })).subscribe(() => this.isLoadingResults = false);
    }, 0);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.clips?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selection.select(...this.clips);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TwitchClipDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
