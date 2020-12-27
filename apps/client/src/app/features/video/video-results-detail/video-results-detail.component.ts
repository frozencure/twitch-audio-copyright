import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';
import { IdentifiedSong, Label, Video } from '@twitch-audio-copyright/data';
import { DashboardService } from '../../../core/services/dashboard.service';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ColorPaletteGenerator, ColorTuple } from '../../../shared/model/color-palette-generator';

@Component({
  selector: 'app-video-results-detail',
  templateUrl: './video-results-detail.component.html',
  styleUrls: ['./video-results-detail.component.scss']
})
export class VideoResultsDetailComponent implements OnInit, OnDestroy {

  private subSink = new SubSink();
  isLoading: boolean;
  identifiedSongs: IdentifiedSong[];
  labelColors: ColorTuple<Label>[];
  video: Video;

  constructor(private activatedRoute: ActivatedRoute,
              private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subSink.sink = combineLatest([this.songsStream(), this.videoStream()]).subscribe(songsAndVideo => {
      this.isLoading = false;
      this.identifiedSongs = songsAndVideo[0];
      this.video = songsAndVideo[1];
      this.labelColors = this.getColorLabels(songsAndVideo[0]);
    });
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  songsDuration(): number {
    return this.identifiedSongs.map(song => song.identificationEnd - song.identificationStart)
      .reduce((a, b) => a + b);
  }

  songsByLabel(label: Label): IdentifiedSong[] {
    return this.identifiedSongs.filter(song => song.label.name === label.name);
  }

  private getColorLabels(songs: IdentifiedSong[]): ColorTuple<Label>[] {
    const labels = songs.map(song => song.label);
    const uniqueLabels = [...new Map(labels.map(label =>
      [label.name, label])).values()];
    const colorPaletteGenerator = new ColorPaletteGenerator(uniqueLabels, 50, 50);
    return colorPaletteGenerator.generateColors();
  }


  private songsStream(): Observable<IdentifiedSong[]> {
    return this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.dashboardService.getVideoSongs(+params.id);
      })
    );
  }

  private videoStream(): Observable<Video> {
    return this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.dashboardService.getVideo(+params.id);
      })
    );
  }

  onVideoUpdate(video: Video) {
    this.video = video;
  }
}
