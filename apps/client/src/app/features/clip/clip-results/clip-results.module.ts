import { NgModule } from '@angular/core';
import { ClipResultsComponent } from './clip-results.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ClipResultsComponent],
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, MatExpansionModule, MatIconModule, MatDividerModule, MatButtonModule],
  exports: [ClipResultsComponent]
})
export class ClipResultsModule {
}
