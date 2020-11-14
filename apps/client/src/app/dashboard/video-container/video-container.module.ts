import { NgModule } from '@angular/core';
import { VideoContainerComponent } from './video-container.component';
import { VideoResolver } from './video.resolver.service';
import { VideoItemModule } from '../video-item/video-item.module';
import { CommonModule } from '@angular/common';
import { ClipItemModule } from '../clip-item/clip-item.module';

@NgModule({
  declarations: [ VideoContainerComponent ],
  imports: [
    CommonModule,
    VideoItemModule,
    ClipItemModule
  ],
  exports: [ VideoContainerComponent ],
  providers: [ VideoResolver ]
})
export class VideoContainerModule {
}
