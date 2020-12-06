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
import { ClipContainerModule } from '../clip-container/clip-container.module';

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
    ClipContainerModule
  ],
  providers: [CookieService, DashboardService],
  exports: [DashboardComponent]
})
export class DashboardModule {
}
