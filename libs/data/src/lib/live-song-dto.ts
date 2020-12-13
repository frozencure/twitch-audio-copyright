export interface LiveSongDto {
  title: string;
  artists: string[];
  label: string;
  identifiedAt: Date;
  playedDuration: number;
  totalDuration: number;
  score: number;
  twitchVideoUrl?: string;
}
