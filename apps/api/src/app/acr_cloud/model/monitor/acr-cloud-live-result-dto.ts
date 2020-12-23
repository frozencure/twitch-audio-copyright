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
      album: identifiedSong.album.name,
      label: identifiedSong.label,
      identifiedAt: new Date(this.toISODateString(this.metadata.timestamp_utc)),
      playedDuration: this.metadata.played_duration,
      totalDuration: identifiedSong.duration_ms / 1000,
      score: identifiedSong.score
    };
  }

  private toISODateString(acrDate: string): string {
    const segments = acrDate.split(' ');
    return `${segments[0]}T${segments[1]}.000Z`;
  }

}
