import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { VideoContainerComponent } from '../video-container/video-container.component';
import { VideoResolver } from '../video-container/video.resolver.service';
import { ClipContainerComponent } from '../clip-container/clip-container.component';
import { ClipResolver } from '../clip-container/clip.resolver.service';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: 'videos', component: VideoContainerComponent, resolve: { routeResolver: VideoResolver } },
      { path: 'clips', component: ClipContainerComponent, resolve: { routeResolver: ClipResolver } },
      { path: '', redirectTo: 'videos' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {
}
