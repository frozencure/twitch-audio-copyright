import { LiveSong } from '@twitch-audio-copyright/data';

export interface LiveSongsResults {
  hasActiveStreamMonitor: boolean;
  liveSongs: Array<LiveSong>;
}
