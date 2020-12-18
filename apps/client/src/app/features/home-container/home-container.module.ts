import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeContainerComponent } from './home-container.component';
import { HomeSummaryCardComponent } from '../home-summary-card/home-summary-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeContainerResolver } from './home-container.resolver.service';
import { HomeLiveCardComponent } from '../home-live-card/home-live-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [HomeContainerComponent, HomeSummaryCardComponent, HomeLiveCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  exports: [HomeContainerComponent],
  providers: [HomeContainerResolver]
})
export class HomeContainerModule {
}
