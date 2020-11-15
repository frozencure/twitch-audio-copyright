import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';
import { AuthState } from './auth.state';
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter';

const APP_STATES = [ AuthState ];

@NgModule({
  imports: [ NgxsModule.forRoot(APP_STATES), NgxsEmitPluginModule.forRoot() ],
  exports: [ NgxsModule ]
})
export class NgxsStoreModule {
}
