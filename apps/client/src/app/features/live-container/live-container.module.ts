import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveContainerComponent } from './live-container.component';

@NgModule({
  declarations: [LiveContainerComponent],
  imports: [
    CommonModule
  ],
  exports: [LiveContainerComponent]
})
export class LiveContainerModule {
}
