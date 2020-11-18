import { Module } from '@nestjs/common';
import { AcrCloudService } from './acr-cloud.service';
import { AudioProcessingController } from './audio-processing.controller';

@Module({
  controllers: [AudioProcessingController],
  imports: [],
  providers: [AcrCloudService]
})
export class AudioProcessingModule {
}
