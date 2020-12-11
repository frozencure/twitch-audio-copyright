import { HttpModule, Module } from '@nestjs/common';
import { AcrCloudFileService } from './files/acr-cloud-file.service';
import { AcrCloudProcessingController } from './acr-cloud-processing.controller';
import { AcrCloudMonitorService } from './monitor/acr-cloud-monitor.service';

@Module({
  controllers: [AcrCloudProcessingController],
  imports: [HttpModule],
  exports: [AcrCloudFileService],
  providers: [AcrCloudFileService, AcrCloudMonitorService]
})
export class AcrCloudProcessingModule {
}
