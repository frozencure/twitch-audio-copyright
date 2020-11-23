import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './core/authentication/login.component';
import { AuthGuard } from './core/authentication/auth.guard';
import { DashboardResolver } from './core/resolver/dashboard.resolver.service';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [ AuthGuard ],
    resolve: { routeResolver: DashboardResolver },
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
