import { Status } from './status';
import { FileMetadata } from './files/file-metadata';

export interface AcrCloudDto {
  status: Status;
  metadata: FileMetadata;
  cost_time: number;
  result_type: number;
}

export class AcrResult {
  acrCloudDto?: AcrCloudDto;
  chunkDurationInSeconds: number;

  constructor(chunkDurationInSeconds: number, acrCloudDto?: AcrCloudDto) {
    this.acrCloudDto = acrCloudDto;
    this.chunkDurationInSeconds = chunkDurationInSeconds;
  }

  hasEmptyResult(): boolean {
    return !this.acrCloudDto || !this.acrCloudDto.status
      || this.acrCloudDto.status.code == 1001 || !this.acrCloudDto.metadata || !this.acrCloudDto.metadata.music;
  }
}
