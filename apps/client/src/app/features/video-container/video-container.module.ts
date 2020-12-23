import { NgModule } from '@angular/core';
import { VideoContainerComponent } from './video-container.component';
import { CommonModule } from '@angular/common';
import { ClipItemModule } from '../clip-item/clip-item.module';
import { VideoTableModule } from '../video-table/video-table.module';
import { ConfirmVideosModule } from '../video-confirm/confirm-videos.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

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
  exports: [VideoContainerComponent]
})
export class VideoContainerModule {
}
