import { Module } from '@nestjs/common';
import { AcrCloudFileService } from './files/acr-cloud-file.service';
import { AcrCloudMonitorService } from './monitor/acr-cloud-monitor.service';

@Module({
  exports: [AcrCloudFileService, AcrCloudMonitorService],
  providers: [AcrCloudFileService, AcrCloudMonitorService]
})
export class AcrCloudProcessingModule {
}
