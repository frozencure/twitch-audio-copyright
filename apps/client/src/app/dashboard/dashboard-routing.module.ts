import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { VideoContainerComponent } from './video-container/video-container.component';
import { VideoResolver } from './video-container/video.resolver.service';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: 'videos', component: VideoContainerComponent, resolve: { routeResolver: VideoResolver }
      },
      { path: '', redirectTo: 'videos' }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class DashboardRoutingModule {
}
