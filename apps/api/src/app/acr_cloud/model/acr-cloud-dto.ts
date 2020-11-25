import { Status } from './status';
import { Metadata } from './metadata';

export interface AcrCloudDto {
  status: Status;
  metadata: Metadata;
  cost_time: number;
  result_type: number;
}


export class AcrResult {
  acrCloudDto: AcrCloudDto;
  chunkDurationInSeconds: number;


  constructor(acrCloudDto: AcrCloudDto, chunkDurationInSeconds: number) {
    this.acrCloudDto = acrCloudDto;
    this.chunkDurationInSeconds = chunkDurationInSeconds;
  }

  hasEmptyResult(): boolean {
    return this.acrCloudDto.status.code === 1001;
  }
}
