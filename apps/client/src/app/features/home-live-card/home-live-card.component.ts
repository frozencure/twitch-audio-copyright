import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LiveSong, LiveSongsResults, TimeConversion } from '@twitch-audio-copyright/data';

@Component({
  selector: 'app-home-live-card',
  templateUrl: './home-live-card.component.html',
  styleUrls: ['./home-live-card.component.scss', './../home-container/home-container.component.scss']
})
export class HomeLiveCardComponent implements OnInit, OnDestroy {

  @Input() liveSongs$: Observable<LiveSongsResults>;
  liveSongs: LiveSong[];
  liveSongsSubscription: Subscription;
  @Output() refreshEventEmitter = new EventEmitter<void>();
  state: 'isLoading' | 'noActiveMonitor' | 'empty' | 'hasContent';

  constructor() {
  }

  ngOnInit(): void {
    this.state = 'isLoading';
    this.liveSongsSubscription = this.liveSongs$.subscribe(liveSongsResults => {
      if (liveSongsResults.hasActiveStreamMonitor) {
        if (liveSongsResults.liveSongs.length > 0) {
          this.state = 'hasContent';
        } else {
          this.state = 'empty';
        }
        this.liveSongs = liveSongsResults.liveSongs;
      } else {
        this.state = 'noActiveMonitor';
      }
    });
  }

  ngOnDestroy(): void {
    this.liveSongsSubscription.unsubscribe();
  }

  onRefresh(): void {
    this.state = 'isLoading';
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
      + ` out of ${TimeConversion.secondsToHoursMinutesSeconds(total)}`;
  }

  getLocalDate(liveSongs: LiveSong[]): Date {
    return new Date(this.getLatestSong(liveSongs).identifiedAt);
  }
}
