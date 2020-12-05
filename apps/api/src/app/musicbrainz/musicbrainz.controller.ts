import { Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import { MusicbrainzService } from './musicbrainz.service';
import { LabelMetadataModel } from './model/label-metadata-model';

@Controller('/metadata')
export class MusicbrainzController {

  constructor(private readonly musicBrainzService: MusicbrainzService) {
  }

  @Get()
  public async getMetadata(@Query('label') label: string): Promise<LabelMetadataModel | InternalServerErrorException> {
    try {
      return await this.musicBrainzService.getLabelMetadata(label);
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }
}
