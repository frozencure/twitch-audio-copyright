import { Status } from './status';
import { Metadata } from './metadata';

export interface AcrCloudDto {
  status: Status;
  metadata: Metadata;
  cost_time: number;
  result_type: number;
}
