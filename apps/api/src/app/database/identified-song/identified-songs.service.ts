import { Injectable, Logger } from '@nestjs/common';
import { AcrCloudDto } from '../../acr_cloud/model/acr-cloud-dto';
import IdentifiedSong from './identified-song.entity';
import { VideosService } from '../video/videos.service';
import { ClipNotFoundError, VideoNotFoundError } from '../errors';
import { AcrEmptyResponseError } from '../../acr_cloud/model/errors';
import { ClipsService } from '../clip/clips.service';
import { MusicbrainzService } from '../../musicbrainz/musicbrainz.service';
import LabelMetadata from '../entity/label-metadata.entity';

@Injectable()
export class IdentifiedSongsService {

  constructor(private readonly videosService: VideosService,
              private readonly clipsService: ClipsService,
              private readonly musicBrainzService: MusicbrainzService) {
  }

  async insertIdentifiedSongForClip(acrDto: AcrCloudDto, clipId: string,
                                    identificationStart: number, identificationEnd: number): Promise<IdentifiedSong> {
    const clip = await this.clipsService.findOne(clipId);
    //TODO: only top 1 result is saved currently -> test if saving all results works better
    const identifiedSongMetadata = acrDto.metadata.music.sort((a, b) => b.score - a.score)
      .find(a => a);
    if (!clip) {
      throw new ClipNotFoundError(`Clip with ID ${clipId} could not be found in database.`);
    }
    if (!identifiedSongMetadata) {
      throw new AcrEmptyResponseError(`Song could not be inserted for clip with ID ${clipId}` +
        `ACR response contains no data.`);
    }
    const identifiedSong = IdentifiedSong.FromAcrResponse(identifiedSongMetadata,
      identificationStart, identificationEnd, null, clip);
    await this.setLabelMetadata(identifiedSong).catch(e =>
      Logger.warn(`Label-metadata could not be retrieved for ISRC ${identifiedSong.isrcId}. Error: ${e}`));
    Logger.debug(`Identified song '${identifiedSong.title}' was inserted for clip ${clipId}.`);
    return await identifiedSong.save();
  }

  async insertIdentifiedSongForVideo(videoId: number, identificationStart: number, identificationEnd: number,
                                     acrDto: AcrCloudDto): Promise<IdentifiedSong> {
    const video = await this.videosService.findOne(videoId);
    //TODO: only top 1 result is saved currently -> test if saving all results works better
    const identifiedSongMetadata = acrDto.metadata.music.sort((a, b) => b.score - a.score)
      .find(a => a);
    if (!video) {
      throw new VideoNotFoundError(`Video with ID ${videoId} could not be found in database.`);
    }
    if (!identifiedSongMetadata) {
      throw new AcrEmptyResponseError(`Song could not be inserted for VOD with ID ${videoId}` +
        `ACR response contains no data.`);
    }
    const identifiedSong = IdentifiedSong.FromAcrResponse(identifiedSongMetadata,
      identificationStart, identificationEnd, video);
    await this.setLabelMetadata(identifiedSong).catch(e =>
      Logger.warn(`Label-metadata could not be retrieved for ISRC ${identifiedSong.isrcId}. Error: ${e}`));
    Logger.debug(`Identified song '${identifiedSong.title}' was inserted for video ${videoId}.`);
    return await identifiedSong.save();
  }

  private async setLabelMetadata(identifiedSong: IdentifiedSong): Promise<void> {
    const labelMetadata = await this.musicBrainzService.getLabelMetadata(identifiedSong.label.name);
    if (labelMetadata) {
      identifiedSong.label.metadata = LabelMetadata.FromLabelMetadataModel(labelMetadata);
    }
  }
}
