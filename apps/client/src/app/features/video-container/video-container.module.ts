import { NgModule } from '@angular/core';
import { VideoContainerComponent } from './video-container.component';
import { CommonModule } from '@angular/common';
import { ClipItemModule } from '../clip-item/clip-item.module';
import { VideoTableModule } from '../video-table/video-table.module';
import { ConfirmVideosModule } from '../video-confirm/confirm-videos.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoResolver } from './video.resolver.service';

@NgModule({
  declarations: [VideoContainerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VideoTableModule,
    ConfirmVideosModule,
    ClipItemModule,
    MatStepperModule,
    MatButtonModule
  ],
  exports: [VideoContainerComponent],
  providers: [VideoResolver]
})
export class VideoContainerModule {
}
