import { Controller, Get, Param, Query } from '@nestjs/common';
import { AcrCloudFileService } from './files/acr-cloud-file.service';
import { Observable } from 'rxjs';
import { AcrCloudMonitorService } from './monitor/acr-cloud-monitor.service';


@Controller('/acr_cloud')
export class AcrCloudProcessingController {

  static readonly testPath = '/home/iancu/Downloads/m3u8/794175057/7941750573_0.ogg';

  constructor(private readonly audioProcessingService: AcrCloudFileService,
              private readonly monitorService: AcrCloudMonitorService) {
  }


  @Get('fingerprint')
  public async fingerprint(@Param('input') inputFile =
                             AcrCloudProcessingController.testPath) {
    const res = await this.audioProcessingService.identify(inputFile);
    return res.acrCloudDto.metadata.music[0];
  }

  @Get('monitor')
  public async addMonitor(@Query('url') url: string,
                          @Query('name') name: string): Promise<unknown> {
    const res = await this.monitorService.addStream(url, name);
    return res;
  }

}
