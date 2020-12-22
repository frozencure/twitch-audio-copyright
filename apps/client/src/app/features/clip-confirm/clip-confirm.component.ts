import { Component, Input, OnInit } from '@angular/core';
import { TimeConversion, TwitchClip } from '@twitch-audio-copyright/data';
import { HelixClip, HelixGame } from 'twitch';
import { Observable } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadDialogComponent } from '../download-dialog/download-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clip-confirm',
  templateUrl: './clip-confirm.component.html',
  styleUrls: ['./clip-confirm.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipConfirmComponent implements OnInit {

  @Input() selectedClips: HelixClip[];
  @Input() games$: Observable<HelixGame[]>;
  displayedColumns = ['title', 'game', 'created_at', 'views'];
  isLoading = false;

  constructor(private dashboardService: DashboardService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  public getTotalClipsDuration() {
    return TimeConversion.secondsToHoursMinutesSeconds(this.selectedClips.length * 60, true);
  }

  getGameName(games: HelixGame[], gameId: string): string {
    const game = games.find(game => game.id === gameId);
    if (game) {
      return game.name;
    } else {
      return 'Unknown';
    }
  }

  onConfirm() {
    this.isLoading = true;
    this.dashboardService.downloadClips(this.selectedClips.map(clip => new TwitchClip(clip)))
      .pipe(map(response => response.clipDownloads.map(result => {
        return { item: result.clip, status: result.status, error: result.error };
      }))).subscribe(results => {
      this.isLoading = false;
      console.log(results);
      this.dialog.open(DownloadDialogComponent, {
        data: { type: 'clip', results: results },
        disableClose: true,
        hasBackdrop: true
      });
    });
  }
}
