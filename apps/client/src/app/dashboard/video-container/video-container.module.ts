import { NgModule } from '@angular/core';
import { VideoContainerComponent } from './video-container.component';
import { VideoResolver } from './video.resolver.service';
import { VideoItemModule } from '../video-item/video-item.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ VideoContainerComponent ],
  imports: [
    CommonModule,
    VideoItemModule
  ],
  exports: [ VideoContainerComponent ],
  providers: [ VideoResolver ]
})
export class VideoContainerModule {
}
