import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { AppRoutingModule } from './app.routing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,
    DashboardModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true } ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
