import { IdentifiedAudioRecording } from './identified-audio-recording';

export interface Metadata {
  music: IdentifiedAudioRecording[];
  timestamp_utc: string;
}
