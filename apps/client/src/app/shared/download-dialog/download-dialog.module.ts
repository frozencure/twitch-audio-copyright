import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadDialogComponent } from './download-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [DownloadDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    MatDividerModule
  ],
  exports: [DownloadDialogComponent]
})
export class DownloadDialogModule {
}
