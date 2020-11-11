import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NavbarModule } from './navbar/navbar.module';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ DashboardComponent ],
  imports: [
    MatButtonModule,
    MatSidenavModule,
    NavbarModule,
    MatListModule,
    MatIconModule,
    RouterModule
  ],
  exports: [ DashboardComponent ]
})
export class DashboardModule {
}
