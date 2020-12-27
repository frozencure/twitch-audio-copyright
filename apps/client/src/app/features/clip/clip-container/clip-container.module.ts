import { NgModule } from '@angular/core';
import { ClipContainerComponent } from './clip-container.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ClipTableComponent } from '../clip-table/clip-table.component';
import { ClipConfirmComponent } from '../clip-confirm/clip-confirm.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DownloadDialogModule } from '../../../shared/download-dialog/download-dialog.module';

@NgModule({
  declarations: [ClipContainerComponent, ClipTableComponent, ClipConfirmComponent],
  imports: [
    MatStepperModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    DownloadDialogModule
  ],
  exports: [ClipContainerComponent]
})
export class ClipContainerModule {
}
