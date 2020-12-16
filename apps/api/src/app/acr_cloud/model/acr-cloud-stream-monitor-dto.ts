export interface AcrCloudStreamMonitorDto {
  id: string;
  url: string;
  state: string;
  interval: number;
  rec_length: number;
  rec_timeout: number;
  stream_name: string;
  region: string;
  realtime: boolean;
  record: string;
}
