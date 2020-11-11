import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { AppRoutingModule } from './app.routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { NgxsStoreModule } from './store/store.module';
import { DashboardResolver } from './dashboard/dashboard.resolver.service';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxsStoreModule,
    LoginModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }, DashboardResolver ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
