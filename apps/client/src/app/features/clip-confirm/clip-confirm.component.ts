import { Component, Input, OnInit } from '@angular/core';
import { TimeConversion } from '@twitch-audio-copyright/data';
import { HelixClip, HelixGame } from 'twitch';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clip-confirm',
  templateUrl: './clip-confirm.component.html',
  styleUrls: ['./clip-confirm.component.scss', './../dashboard/dashboard.component.scss']
})
export class ClipConfirmComponent implements OnInit {

  @Input() selectedClips: HelixClip[];
  @Input() games$: Observable<HelixGame[]>;
  displayedColumns = ['title', 'game', 'created_at', 'views'];

  constructor() {
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


}
