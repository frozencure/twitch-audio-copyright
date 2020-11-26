import { Injectable, Logger } from '@nestjs/common';
import { AcrCloudDto } from '../../acr_cloud/model/acr-cloud-dto';
import IdentifiedSong from './identified-song.entity';
import { VideosService } from '../video/videos.service';
import Label from '../entity/label.entity';
import Album from '../entity/album.entity';
import { IdentifiedAudioRecording } from '../../acr_cloud/model/identified-audio-recording';
import Artist from '../entity/artist.entity';
import { ClipNotFoundError, VideoNotFoundError } from '../errors';
import { EmptyAcrCloudResponseError } from '../../acr_cloud/model/errors';
import { ClipsService } from '../clip/clips.service';


@Injectable()
export class IdentifiedSongsService {

  constructor(private readonly videosService: VideosService,
              private readonly clipsService: ClipsService) {
  }

  async insertIdentifiedSongForVideo(videoId: number, identificationStart: number, identificationEnd: number,
                                     acrDto: AcrCloudDto): Promise<IdentifiedSong> {
    const video = await this.videosService.findOne(videoId);
    if (!video) {
      return Promise.reject(new VideoNotFoundError(`Identified song could not be inserted. Video with ID` +
        `${videoId} was not found in the database.`));
    }
    const identifiedSong = this.createIdentifiedSong(acrDto, identificationStart, identificationEnd);
    identifiedSong.video = video;
    Logger.debug(`Identified song '${identifiedSong.title}' was inserted for video ${videoId}.`);
    return identifiedSong.save();
  }

  async insertIdentifiedSongForVideoForClip(clipId: string, identificationStart: number, identificationEnd: number,
                                            acrDto: AcrCloudDto): Promise<IdentifiedSong> {
    const clip = await this.clipsService.findOne(clipId);
    if (!clip) {
      return Promise.reject(new ClipNotFoundError(`Identified song could not be inserted. Clip with ID` +
        `${clipId} was not found in the database.`));
    }
    const identifiedSong = this.createIdentifiedSong(acrDto, identificationStart, identificationEnd);
    identifiedSong.clip = clip;
    Logger.debug(`Identified song '${identifiedSong.title}' was inserted for clip ${clipId}.`);
    return identifiedSong.save();
  }

  private createIdentifiedSong(acrDto: AcrCloudDto, identificationStart: number, identificationEnd: number): IdentifiedSong {
    const identifiedSongMetadata = acrDto.metadata.music.sort((a, b) => b.score - a.score)
      .find(a => a);
    if (!identifiedSongMetadata) {
      throw new EmptyAcrCloudResponseError(`Identified song could not be inserted. ACR cloud returned` +
        `an empty response with ${acrDto.status}.`);
    }
    const identifiedSong = new IdentifiedSong();
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
    return identifiedSong;
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
