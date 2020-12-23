import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { SubSink } from 'subsink';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HelixClip, HelixGame } from 'twitch';
import { combineLatest, Observable } from 'rxjs';

@Component({
  selector: 'app-clip-table',
  templateUrl: './clip-table.component.html',
  styleUrls: ['./clip-table.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipTableComponent implements OnInit, AfterViewInit {

  @Input() clips$: Observable<HelixClip[]>;
  @Input() games$: Observable<HelixGame[]>;
  games: HelixGame[];
  clips: HelixClip[];
  @Output() selectedClips: EventEmitter<HelixClip[]> = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<HelixClip>;
  public displayedColumns = ['select', 'title', 'game', 'created_at', 'views'];
  public selection = new SelectionModel<HelixClip>(true, []);
  private subscriptions = new SubSink();
  isLoading = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.subscriptions.sink = this.selection.changed.asObservable()
      .subscribe(data => this.selectedClips.emit(data.source.selected));
  }

  ngAfterViewInit(): void {
    this.subscriptions.sink = combineLatest([this.clips$, this.games$]).subscribe(clipsAndGames => {
        this.clips = clipsAndGames[0];
        this.games = clipsAndGames[1];
        this.dataSource = new MatTableDataSource<HelixClip>(clipsAndGames[0]);
        this.initializeDataSourceOptions();
        this.isLoading = false;
      }
    );
  }

  private initializeDataSourceOptions(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'created_at':
          return item.creationDate;
        case 'views':
          return item.views;
        default:
          return item[property];
      }
    };
  }

  getGameName(gameId: string): string {
    const game = this.games.find(game => game.id === gameId);
    if (game) {
      return game.name;
    } else {
      return 'Unknown';
    }
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
  checkboxLabel(row?: HelixClip): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
