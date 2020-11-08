import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ DashboardComponent ],
  imports: [
    MatButtonModule
  ],
  exports: [ DashboardComponent ]
})
export class DashboardModule {
}
