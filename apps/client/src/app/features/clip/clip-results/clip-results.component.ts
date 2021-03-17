import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SubSink } from 'subsink';
import { Clip, UserActionType } from '@twitch-audio-copyright/data';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmAction } from '../../../shared/confirm-dialog/confirm-dialog-data';

@Component({
  selector: 'app-clip-results',
  templateUrl: './clip-results.component.html',
  styleUrls: ['./clip-results.component.scss']
})
export class ClipResultsComponent implements OnInit {

  private subSink = new SubSink();
  selectSubject = new BehaviorSubject(UserActionType.NEEDS_REVIEW);
  selectedUserAction: string;
  clips: Clip[];
  isLoading = false;
  UserActionType = UserActionType;

  constructor(private dashboardService: DashboardService,
              private confirmDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subSink.sink = this.subSink.sink = this.filteredClips(this.selectSubject).subscribe(clips => {
      this.clips = clips;
      this.isLoading = false;
    });
  }

  onSelect(value: UserActionType) {
    this.isLoading = true;
    this.selectSubject.next(value);
  }

  private filteredClips(selectStream: Observable<UserActionType>): Observable<Clip[]> {
    return selectStream.pipe(
      switchMap(selectValue => {
        this.selectedUserAction = selectValue.toString();
        return this.dashboardService.getClips(null, selectValue, true);
      })
    );
  }

  openWindow(wikipediaUrl: string): void {
    window.open(wikipediaUrl);
  }

  reviewClip(clip: Clip): void {
    const dialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: {
        contentTitle: 'Review clip results',
        contentText: `This clip will be marked as reviewed. Clips deletion is not available yet.` +
          ` Please visit the Twitch Creator Dashboard if you would like to delete this clip. `,
        confirmButtonText: 'Confirm review',
        cancelButtonText: 'Cancel'
      }
    });
    dialogRef.afterClosed().pipe(
      filter(action => action === ConfirmAction.CONFIRM),
      tap(() => this.isLoading = true),
      switchMap(() => {
        return this.dashboardService.updateClip({ id: clip.id, userAction: UserActionType.PUBLIC });
      })
    ).subscribe(() => this.onSelect(UserActionType.NEEDS_REVIEW))
  }
}
