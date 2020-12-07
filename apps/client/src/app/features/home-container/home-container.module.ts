import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './home-container.component';
import { HomeSummaryCardComponent } from '../home-summary-card/home-summary-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeContainerResolver } from './home-container.resolver.service';

@NgModule({
  declarations: [HomeContainerComponent, HomeSummaryCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [HomeContainerComponent],
  providers: [HomeContainerResolver]
})
export class HomeContainerModule {
}
