import { NgModule } from '@angular/core';
import { VideoTableComponent } from './video-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [VideoTableComponent],
  imports: [
    MatProgressSpinnerModule,
    MatSortModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    CommonModule
  ],
  exports: [VideoTableComponent]
})
export class VideoTableModule{}
