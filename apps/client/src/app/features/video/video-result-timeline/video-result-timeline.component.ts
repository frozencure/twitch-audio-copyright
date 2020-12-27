import { Component, Input, OnInit } from '@angular/core';
import { IdentifiedSong, Label, TimeConversion, Video } from '@twitch-audio-copyright/data';
import { ColorPaletteGenerator, ColorTuple } from '../../../shared/model/color-palette-generator';

@Component({
  selector: 'app-video-result-timeline',
  templateUrl: './video-result-timeline.component.html',
  styleUrls: ['./video-result-timeline.component.scss']
})
export class VideoResultTimelineComponent implements OnInit {

  @Input() songs: IdentifiedSong[];
  @Input() video: Video;
  @Input() labelColors: ColorTuple<Label>[];

  constructor() {
  }

  ngOnInit(): void {
  }

  getColorForLabel(label: Label): string {
    return this.labelColors
      .find(colorTuple => colorTuple.item.name === label.name).color;
  }

  durationToPercentage(song: IdentifiedSong): number {
    const duration = song.identificationEnd - song.identificationStart;
    return 100 * duration / this.video.durationInSeconds;
  }

  secondsToPercentage(seconds: number): number {
    return 100 * seconds / this.video.durationInSeconds;
  }

  songDuration(song: IdentifiedSong): number {
    const duration = song.identificationEnd - song.identificationStart;
    if(duration > song.totalSongDurationInSeconds) {
      return song.totalSongDurationInSeconds;
    }
    return duration;
  }

  durationPipe(seconds: number): string {
    return TimeConversion.secondsToHoursMinutesSeconds(seconds, false);
  }
}
