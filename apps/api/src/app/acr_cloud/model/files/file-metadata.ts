import { IdentifiedAudioRecording } from '../identified-audio-recording';

export interface FileMetadata {
  music: IdentifiedAudioRecording[];
  timestamp_utc: string;
}
