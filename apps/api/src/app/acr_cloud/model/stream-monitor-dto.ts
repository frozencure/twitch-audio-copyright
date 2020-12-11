export interface StreamMonitorDto {
  id: string;
  url: string;
  state: number;
  interval: number;
  rec_length: number;
  rec_timeout: number;
  stream_name: string;
  region: string;
  realtime: boolean;
  record: string;
}
