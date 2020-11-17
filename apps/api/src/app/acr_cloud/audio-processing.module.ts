import { HttpModule, Module } from '@nestjs/common';
import { AcrCloudService } from './acr-cloud.service';
import { AudioProcessingController } from './audio-processing.controller';

@Module({
  controllers: [AudioProcessingController],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [AcrCloudService]
})
export class AudioProcessingModule {
}
