import { IdentifiedLiveRecording } from './identified-live-recording';

export interface MonitorMetadata {
  live_id: string;
  timestamp_utc: Date;
  played_duration: number;
  music: IdentifiedLiveRecording[]
}
