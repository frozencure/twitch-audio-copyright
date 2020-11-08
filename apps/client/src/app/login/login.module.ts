import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ LoginComponent ],
  exports: [ LoginComponent ],
  imports: [
    HttpClientModule,
    MatButtonModule
  ]
})
export class LoginModule {
}
