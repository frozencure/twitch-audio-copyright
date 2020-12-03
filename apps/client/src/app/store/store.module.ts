import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';
import { AuthState } from './auth.state';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';
import { environment } from '../../environments/environment';

const APP_STATES = [AuthState];

@NgModule({
  imports: [NgxsModule.forRoot(APP_STATES, { developmentMode: !environment.production }), NgxsEmitPluginModule.forRoot()],
  exports: [NgxsModule]
})
export class NgxsStoreModule {
}
