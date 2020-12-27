import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SpinnerDialogComponent } from './spinner-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from './spinner.service';

@NgModule({
  declarations: [SpinnerDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [SpinnerService]
})
export class SpinnerDialogModule {
}
