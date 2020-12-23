import { NgModule } from '@angular/core';
import { VideoResultsComponent } from './video-results.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [VideoResultsComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatIconModule, MatButtonModule],
  exports: [VideoResultsComponent]
})
export class VideoResultsModule {
}
