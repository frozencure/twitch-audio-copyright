import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NavbarModule } from '../../shared/navbar/navbar.module';
import { MatListModule } from '@angular/material/list';
import { VideoContainerModule } from '../video-container/video-container.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { DashboardService } from '../../core/services/dashboard.service';
import { HomeContainerModule } from '../home-container/home-container.module';
import { ClipContainerModule } from '../clip-container/clip-container.module';
import { LiveContainerModule } from '../live-container/live-container.module';
import { TwitchService } from '../../core/services/twitch.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    DashboardRoutingModule,
    NavbarModule,
    VideoContainerModule,
    ClipContainerModule,
    HomeContainerModule,
    LiveContainerModule
  ],
  providers: [CookieService, DashboardService, TwitchService],
  exports: [DashboardComponent]
})
export class DashboardModule {
}
