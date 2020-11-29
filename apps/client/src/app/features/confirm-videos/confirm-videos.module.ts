import { NgModule } from '@angular/core';
import { ConfirmVideosComponent } from './confirm-videos.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ConfirmVideosComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  exports: [ConfirmVideosComponent]
})
export class ConfirmVideosModule{}
