import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { NavbarModule } from './components/navbar/navbar.module';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    NavbarModule,
    NavbarModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
