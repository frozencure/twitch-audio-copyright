import { Controller, Get, Param } from '@nestjs/common';
import { AcrCloudService } from './acr-cloud.service';


@Controller('/acr_cloud')
export class AcrCloudProcessingController {

  static readonly testPath = '/home/iancu/Downloads/m3u8/794175057/7941750573_0.ogg';

  constructor(private readonly audioProcessingService: AcrCloudService) {
  }


  @Get('fingerprint')
  public async fingerprint(@Param('input') inputFile =
                             AcrCloudProcessingController.testPath) {
    const res = await this.audioProcessingService.identify(inputFile);
    return res.acrCloudDto.metadata.music[0];
  }
}
