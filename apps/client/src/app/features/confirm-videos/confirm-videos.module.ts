import { NgModule } from '@angular/core';
import { ConfirmVideosComponent } from './confirm-videos.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConfirmVideosComponent],
  imports: [
    CommonModule
  ],
  exports: [ConfirmVideosComponent]
})
export class ConfirmVideosModule{}
