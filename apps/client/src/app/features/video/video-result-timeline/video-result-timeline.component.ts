import { Component, Input, OnInit } from '@angular/core';
import { IdentifiedSong, Video } from '@twitch-audio-copyright/data';
import { ColorPaletteGenerator, ColorTuple } from '../../../shared/model/color-palette-generator';

@Component({
  selector: 'app-video-result-timeline',
  templateUrl: './video-result-timeline.component.html',
  styleUrls: ['./video-result-timeline.component.scss']
})
export class VideoResultTimelineComponent implements OnInit {

  @Input() songs: IdentifiedSong[];
  @Input() video: Video;
  colorDictionary: ColorTuple<IdentifiedSong>[];

  constructor() {
  }

  ngOnInit(): void {
    const colorPaletteGenerator = new ColorPaletteGenerator(this.songs, 50, 50);
    this.colorDictionary = colorPaletteGenerator.generateColors();
    console.log(this.colorDictionary);
  }

  durationToPercentage(song: IdentifiedSong): number {
    const duration = song.identificationEnd - song.identificationStart;
    return 100 * duration / this.video.durationInSeconds;
  }

  secondsToPercentage(seconds: number): number {
    return 100 * seconds / this.video.durationInSeconds;
  }

}
