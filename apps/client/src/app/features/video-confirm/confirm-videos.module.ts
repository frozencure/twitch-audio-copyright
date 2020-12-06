import { NgModule } from '@angular/core';
import { ConfirmVideosComponent } from './confirm-videos.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ConfirmVideosComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [ConfirmVideosComponent]
})
export class ConfirmVideosModule{}
