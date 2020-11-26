import { Injectable, Logger } from '@nestjs/common';
import { AcrCloudDto } from '../../acr_cloud/model/acr-cloud-dto';
import IdentifiedSong from './identified-song.entity';
import { VideosService } from '../video/videos.service';
import { ClipNotFoundError, VideoNotFoundError } from '../errors';
import { AcrEmptyResponseError } from '../../acr_cloud/model/errors';
import { ClipsService } from '../clip/clips.service';


@Injectable()
export class IdentifiedSongsService {

  constructor(private readonly videosService: VideosService,
              private readonly clipsService: ClipsService) {
  }


  async insertIdentifiedSongForClip(acrDto: AcrCloudDto, clipId: string,
                                    identificationStart: number, identificationEnd: number): Promise<IdentifiedSong> {
    const clip = await this.clipsService.findOne(clipId);
    const identifiedSongMetadata = acrDto.metadata.music.sort((a, b) => b.score - a.score)
      .find(a => a);
    if (!clip) {
      return Promise.reject(new ClipNotFoundError(`Clip with ID ${clipId} could not be found in database.`));
    }
    if (!identifiedSongMetadata) {
      return Promise.reject(new AcrEmptyResponseError(`Song could not be inserted for clip with ID ${clipId}` +
        `ACR response contains no data.`));
    }
    try {
      const identifiedSong = IdentifiedSong.FromAcrResponse(identifiedSongMetadata,
        identificationStart, identificationEnd, null, clip);
      Logger.debug(`Identified song '${identifiedSong.title}' was inserted for clip ${clipId}.`);
      return await identifiedSong.save();
    } catch (e) {
      return Promise.reject(e);
    }
  }


  async insertIdentifiedSongForVideo(videoId: number, identificationStart: number, identificationEnd: number,
                                     acrDto: AcrCloudDto): Promise<IdentifiedSong> {
    const video = await this.videosService.findOne(videoId);
    const identifiedSongMetadata = acrDto.metadata.music.sort((a, b) => b.score - a.score)
      .find(a => a);
    if (!video) {
      return Promise.reject(new VideoNotFoundError(`Video with ID ${videoId} could not be found in database.`));
    }
    if (!identifiedSongMetadata) {
      return Promise.reject(new AcrEmptyResponseError(`Song could not be inserted for VOD with ID ${videoId}` +
        `ACR response contains no data.`));
    }
    try {
      const identifiedSong = IdentifiedSong.FromAcrResponse(identifiedSongMetadata,
        identificationStart, identificationEnd, video);
      Logger.debug(`Identified song '${identifiedSong.title}' was inserted for video ${videoId}.`);
      return await identifiedSong.save();
    } catch (e) {
      return Promise.reject(e);
    }

  }
}
