import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LiveSong, TimeConversion } from '@twitch-audio-copyright/data';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home-live-card',
  templateUrl: './home-live-card.component.html',
  styleUrls: ['./home-live-card.component.scss']
})
export class HomeLiveCardComponent implements OnInit, OnDestroy {

  @Input() liveSongs$: Observable<LiveSong[]>;
  liveSongs: LiveSong[];
  liveSongsSubscription: Subscription;
  @Output() refreshEventEmitter = new EventEmitter<void>();
  isLoading = false;

  constructor() {
  }

  ngOnInit(): void {
    this.liveSongsSubscription = this.liveSongs$.pipe(
      tap(() => this.isLoading = false)
    ).subscribe(songs => this.liveSongs = songs);
  }

  ngOnDestroy(): void {
    this.liveSongsSubscription.unsubscribe();
  }

  onRefresh(): void {
    this.isLoading = true;
    this.refreshEventEmitter.emit();
  }

  getLatestSong(liveSongs: LiveSong[]): LiveSong {
    return liveSongs.reduce((a, b) => a.identifiedAt > b.identifiedAt ? a : b);
  }

  getLatestSongSubtitle(liveSongs: LiveSong[]): string {
    const artists = this.getLatestSong(liveSongs).artists.join(', ');
    const album = this.getLatestSong(liveSongs).album;
    return `${artists} - ${album}`;
  }

  getLatestSongPlayedDuration(liveSongs: LiveSong[]): string {
    const played = this.getLatestSong(liveSongs).playedDuration;
    const total = this.getLatestSong(liveSongs).totalDuration;
    return `${TimeConversion.secondsToHoursMinutesSeconds(played)}`
      + `out of ${TimeConversion.secondsToHoursMinutesSeconds(total)}`;
  }
}
