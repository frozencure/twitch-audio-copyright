import { Status } from './status';
import { FileMetadata } from './files/file-metadata';

export interface AcrCloudDto {
  status: Status;
  metadata: FileMetadata;
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
