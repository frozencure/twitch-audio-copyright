import { Injectable, Logger } from '@nestjs/common';
import { AcrCloudDto } from '../../acr_cloud/model/acr-cloud-dto';
import IdentifiedSong from './identified-song.entity';
import { VideosService } from '../video/videos.service';
import Label from '../entity/label.entity';
import Album from '../entity/album.entity';
import { IdentifiedAudioRecording } from '../../acr_cloud/model/identified-audio-recording';
import Artist from '../entity/artist.entity';


@Injectable()
export class IdentifiedSongsService {

  constructor(private readonly videosService: VideosService) {
  }

  async insertIdentifiedSong(videoId: number, identificationStart: number, identificationEnd: number,
                             acrDto: AcrCloudDto): Promise<IdentifiedSong> {
    const video = await this.videosService.findOne(videoId);
    const identifiedSongMetadata = acrDto.metadata.music.sort((a, b) => b.score - a.score)
      .find(a => a);
    if (video && identifiedSongMetadata) {
      try {
        const identifiedSong = new IdentifiedSong();
        identifiedSong.video = video;
        identifiedSong.acrId = identifiedSongMetadata.acrid;
        identifiedSong.title = identifiedSongMetadata.title;
        identifiedSong.playOffsetInSeconds = Math.round(identifiedSongMetadata.play_offset_ms / 1000);
        identifiedSong.durationInSeconds = Math.round(identifiedSongMetadata.duration_ms / 1000);
        identifiedSong.identificationScore = Math.round(identifiedSongMetadata.score);
        identifiedSong.identificationStart = identificationStart;
        identifiedSong.identificationEnd = identificationEnd;

        IdentifiedSongsService.setLabel(identifiedSong, identifiedSongMetadata);
        IdentifiedSongsService.setAlbum(identifiedSong, identifiedSongMetadata);
        this.setArtists(identifiedSong, identifiedSongMetadata);
        Logger.debug(`Identified song '${identifiedSong.title}' was inserted for video ${videoId}.`);
        return await identifiedSong.save();
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject('Either video could not be found or no song was identified.');
    }

  }

  private static setAlbum(identifiedSong: IdentifiedSong, identifiedAudioRecording: IdentifiedAudioRecording): void {
    const album = new Album();
    album.name = identifiedAudioRecording.album.name;
    identifiedSong.album = album;
  }

  private static setLabel(identifiedSong: IdentifiedSong, identifiedAudioRecording: IdentifiedAudioRecording): void {
    const label = new Label();
    label.name = identifiedAudioRecording.label;
    identifiedSong.label = label;
  }

  private setArtists(identifiedSong: IdentifiedSong, identifiedAudioRecording: IdentifiedAudioRecording): void {
    identifiedSong.artists = identifiedAudioRecording.artists.map(artistDto => {
      const artist = new Artist();
      artist.name = artistDto.name;
      return artist;
    });
  }

}
