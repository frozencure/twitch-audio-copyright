import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { VideoContainerComponent } from '../video-container/video-container.component';
import { HomeContainerComponent } from '../home-container/home-container.component';
import { ClipContainerComponent } from '../clip-container/clip-container.component';
import { HomeContainerResolver } from '../home-container/home-container.resolver.service';
import { LiveContainerComponent } from '../live-container/live-container.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      { path: 'videos', component: VideoContainerComponent },
      { path: 'clips', component: ClipContainerComponent },
      { path: 'home', component: HomeContainerComponent, resolve: { routeResolver: HomeContainerResolver } },
      { path: 'live', component: LiveContainerComponent },
      { path: '', redirectTo: 'home' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule {
}
