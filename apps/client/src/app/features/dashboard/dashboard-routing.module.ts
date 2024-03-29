import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { VideoContainerComponent } from '../video/video-container/video-container.component';
import { HomeContainerComponent } from '../home/home-container/home-container.component';
import { ClipContainerComponent } from '../clip/clip-container/clip-container.component';
import { HomeContainerResolver } from '../home/home-container/home-container.resolver.service';
import { LiveContainerComponent } from '../live-container/live-container.component';
import { VideoResultsComponent } from '../video/video-results/video-results.component';
import { VideoResultsDetailComponent } from '../video/video-results-detail/video-results-detail.component';
import { ClipResultsComponent } from '../clip/clip-results/clip-results.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: 'videos', component: VideoContainerComponent },
      { path: 'clips', component: ClipContainerComponent },
      { path: 'home', component: HomeContainerComponent, resolve: { routeResolver: HomeContainerResolver } },
      { path: 'video-results', component: VideoResultsComponent },
      { path: 'live', component: LiveContainerComponent },
      { path: '', redirectTo: 'home' },
      { path: 'video-results/:id', component: VideoResultsDetailComponent },
      { path: 'clip-results', component: ClipResultsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {
}
