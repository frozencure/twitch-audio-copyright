import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HeroModule } from '../components/hero/hero.module';
import { ServicesModules } from '../components/services/services.modules';
import { WhyModule } from '../components/why/why.module';

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    HeroModule,
    ServicesModules,
    WhyModule
  ],
  exports: [ HomeComponent ]
})
export class HomeModule {
}
