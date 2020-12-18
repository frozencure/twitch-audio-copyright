export interface LiveSong {
  title: string;
  artists: string[];
  album: string;
  label: string;
  identifiedAt: Date;
  playedDuration: number;
  totalDuration: number;
  score: number;
  twitchVideoUrl?: string;
}
