import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ NavbarComponent ],
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatButtonModule
  ],
  exports: [ NavbarComponent ]
})
export class NavbarModule {
}
