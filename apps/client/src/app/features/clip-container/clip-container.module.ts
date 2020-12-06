import { NgModule } from '@angular/core';
import { ClipContainerComponent } from './clip-container.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ClipResolver } from './clip.resolver.service';

@NgModule({
  declarations: [ClipContainerComponent],
  imports: [
    MatStepperModule,
    MatButtonModule
  ],
  exports: [ClipContainerComponent],
  providers: [ClipResolver]
})
export class ClipContainerModule {
}
