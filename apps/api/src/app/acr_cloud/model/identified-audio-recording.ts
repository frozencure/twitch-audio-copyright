import { Album } from './album';
import { Artist } from './artist';
import { Contributors } from './contributors';
import { Genre } from './genre';
import { Lyrics } from './lyrics';


export interface IdentifiedAudioRecording {
  title: string;
  album: Album;
  artists: Artist[];
  contributors: Contributors;
  label: string;
  duration_ms: number;
  score: number;
  release_date: string;
  genres: Genre[];
  acrid: string;
  lyrics: Lyrics;
  play_offset_ms: number;
  result_from: number;
}
