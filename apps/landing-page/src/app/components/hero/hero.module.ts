import { NgModule } from '@angular/core';
import { HeroComponent } from './hero.component';

@NgModule({
  declarations: [ HeroComponent ],
  exports: [ HeroComponent ]
})
export class HeroModule {
}
