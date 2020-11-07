import { HttpModule, HttpService, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VodDownloadController } from './vod/VodDownloadController';
import { VodDownloadService } from './vod/VodDownloadService';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5
  })],
  controllers: [AppController, VodDownloadController],
  providers: [AppService, VodDownloadService]
})
export class AppModule {
}
