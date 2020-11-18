import { Controller, Get, Param } from '@nestjs/common';
import { AcrCloudService } from './acr-cloud.service';
import { IdentifiedAudioRecording } from './model/identified-audio-recording';


@Controller('/acr_cloud')
export class AudioProcessingController {

  static readonly testPath = '/home/iancu/Downloads/m3u8/794175057/794175057_0.ogg';

  constructor(private readonly audioProcessingService: AcrCloudService) {
  }


  @Get('fingerprint')
  public async fingerprint(@Param('input') inputFile =
                             AudioProcessingController.testPath):
    Promise<IdentifiedAudioRecording> {
    const res = await this.audioProcessingService.identify(inputFile);
    return res.metadata.music[0];
  }
}
