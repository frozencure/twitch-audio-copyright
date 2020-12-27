import { Label } from './label';

export class IdentifiedSong {
  id: number;
  acrId: string;
  title: string;
  playOffsetInSeconds: number;
  totalSongDurationInSeconds: number;
  identificationScore: number;
  identificationStart: number;
  identificationEnd: number;
  label: Label;
  album: string;
  artists: string[];
  isrcId?: string;
}
