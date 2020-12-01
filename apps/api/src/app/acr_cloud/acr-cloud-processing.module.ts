import { Module } from '@nestjs/common';
import { AcrCloudService } from './acr-cloud.service';
import { AcrCloudProcessingController } from './acr-cloud-processing.controller';

@Module({
  controllers: [AcrCloudProcessingController],
  exports: [AcrCloudService],
  providers: [AcrCloudService]
})
export class AcrCloudProcessingModule {
}
