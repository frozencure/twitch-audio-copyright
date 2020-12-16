import { Status } from '../status';
import { MonitorMetadata } from './monitor-metadata';
import { LiveSong } from '@twitch-audio-copyright/data';


export class AcrCloudLiveResultDto {

  status: Status;
  result_type: number;
  metadata: MonitorMetadata;
  type: string;

  public toLiveSongDto(): LiveSong {
    const identifiedSong = this.metadata.music.find(s => s);
    return {
      title: identifiedSong.title,
      artists: identifiedSong.artists.map(artist => artist.name),
      label: identifiedSong.label,
      identifiedAt: this.metadata.timestamp_utc,
      playedDuration: this.metadata.played_duration,
      totalDuration: identifiedSong.duration_ms / 1000,
      score: identifiedSong.score
    };
  }

}
