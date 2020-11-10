import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { NavbarModule } from './navbar/navbar.module';

@NgModule({
  declarations: [ DashboardComponent ],
  imports: [
    MatButtonModule,
    MatSidenavModule,
    NavbarModule
  ],
  exports: [ DashboardComponent ]
})
export class DashboardModule {
}
