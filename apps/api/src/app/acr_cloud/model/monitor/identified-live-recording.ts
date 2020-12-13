import { IdentifiedAudioRecording } from '../identified-audio-recording';


export interface IdentifiedLiveRecording extends IdentifiedAudioRecording {
  sample_begin_time_offset_ms: number;
  sample_end_time_offset_ms: number;
  db_begin_time_offset_ms: number;
  db_end_time_offset_ms: number;
}
