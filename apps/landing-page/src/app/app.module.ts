import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { NavbarModule } from './components/navbar/navbar.module';
import { FooterModule } from './components/footer/footer.module';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    NavbarModule,
    HomeModule,
    FooterModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
