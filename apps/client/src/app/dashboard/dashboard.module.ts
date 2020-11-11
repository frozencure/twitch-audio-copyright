import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NavbarModule } from './navbar/navbar.module';
import { MatListModule } from '@angular/material/list';
import { VideoContainerModule } from './video-container/video-container.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [ DashboardComponent ],
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    DashboardRoutingModule,
    NavbarModule,
    VideoContainerModule
  ],
  exports: [ DashboardComponent ]
})
export class DashboardModule {
}
