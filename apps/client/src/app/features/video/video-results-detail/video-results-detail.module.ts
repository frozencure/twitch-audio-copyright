import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoResultsDetailComponent } from './video-results-detail.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideoResultCardComponent } from '../video-result-card/video-result-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VideoResultTimelineComponent } from '../video-result-timeline/video-result-timeline.component';
import { MdePopoverModule } from '@material-extended/mde';

@NgModule({
  declarations: [VideoResultsDetailComponent, VideoResultCardComponent, VideoResultTimelineComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule, MatIconModule, MatButtonModule,
  MdePopoverModule],
  exports: [VideoResultsDetailComponent]
})
export class VideoResultsDetailModule {
}
