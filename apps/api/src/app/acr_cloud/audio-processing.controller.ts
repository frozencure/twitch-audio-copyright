import { Controller, Get, Param } from '@nestjs/common';
import { AcrCloudService } from './acr-cloud.service';
import { IdentifiedAudioRecording } from './model/identified-audio-recording';


@Controller('/acr_cloud')
export class AudioProcessingController {

  constructor(private readonly audioProcessingService: AcrCloudService) {
  }


  @Get('fingerprint')
  public async fingerprint(@Param('input') inputFile =
                             '/home/iancu/Documents/programming/twitch-audio-copyright/apps/api/src/app/acr_cloud/794175057_0.ogg'):
    Promise<IdentifiedAudioRecording> {
    const res = await this.audioProcessingService.identify(inputFile);
    return res.metadata.music[0];
  }
}
