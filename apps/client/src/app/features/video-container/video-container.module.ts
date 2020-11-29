import { NgModule } from '@angular/core';
import { VideoContainerComponent } from './video-container.component';
import { VideoResolver } from './video.resolver.service';
import { CommonModule } from '@angular/common';
import { ClipItemModule } from '../clip-item/clip-item.module';
import { VideoTableModule } from '../video-table/video-table.module';

@NgModule({
  declarations: [VideoContainerComponent],
  imports: [
    CommonModule,
    VideoTableModule,
    ClipItemModule
  ],
  exports: [VideoContainerComponent],
  providers: [VideoResolver]
})
export class VideoContainerModule {
}
