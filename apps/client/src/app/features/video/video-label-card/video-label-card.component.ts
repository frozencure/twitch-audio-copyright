import { Component, Input, OnInit } from '@angular/core';
import { ColorTuple } from '../../../shared/model/color-palette-generator';
import { IdentifiedSong, Label, TimeConversion } from '@twitch-audio-copyright/data';

@Component({
  selector: 'app-video-label-card',
  templateUrl: './video-label-card.component.html',
  styleUrls: ['./video-label-card.component.scss']
})
export class VideoLabelCardComponent implements OnInit {

  @Input() labelColor: ColorTuple<Label>;
  @Input() songs: IdentifiedSong[];
  isCollapsed = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  songDuration(song: IdentifiedSong): number {
    const duration = song.identificationEnd - song.identificationStart;
    if(duration > song.totalSongDurationInSeconds) {
      return song.totalSongDurationInSeconds;
    }
    return duration;
  }

  durationPipe(seconds: number, displayHours = false): string {
    return TimeConversion.secondsToHoursMinutesSeconds(seconds, displayHours);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  goToWikipedia(item: Label) {
    window.open(item.wikipediaUrl);
  }
}
