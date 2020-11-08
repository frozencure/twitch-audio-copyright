import { HttpModule, Module } from '@nestjs/common';
import { VodDownloadService } from './vod-download-service';
import { VodDownloadController } from './vod-download-controller';

@Module({
  controllers: [ VodDownloadController ],
  imports: [
    HttpModule.register({
      timeout: 50000,
      maxRedirects: 5
    })
  ],
  providers: [ VodDownloadService ]
})
export class VodDownloadModule {
}
