import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HeroModule } from '../components/hero/hero.module';

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    HeroModule
  ],
  exports: [ HomeComponent ]
})
export class HomeModule {
}
