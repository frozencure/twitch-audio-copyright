import { NgModule } from '@angular/core';
import { VideoContainerComponent } from './video-container.component';
import { VideoResolver } from './video.resolver.service';

@NgModule({
  declarations: [ VideoContainerComponent ],
  exports: [ VideoContainerComponent ],
  providers:[VideoResolver]
})
export class VideoContainerModule {
}
