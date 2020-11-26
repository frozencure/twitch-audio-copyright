import { Injectable, Logger } from '@nestjs/common';
import { AcrCloudDto } from '../../acr_cloud/model/acr-cloud-dto';
import IdentifiedSong from './identified-song.entity';
import { VideosService } from '../video/videos.service';
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
    const identifiedSongMetadata = acrDto.metadata.music.sort((a, b) => b.score - a.score)
      .find(a => a);
    if (video && identifiedSongMetadata) {
      try {
        const identifiedSong = IdentifiedSong.FromAcrResponse(identifiedSongMetadata,
          identificationStart, identificationEnd, video);
        Logger.debug(`Identified song '${identifiedSong.title}' was inserted for video ${videoId}.`);
        return await identifiedSong.save();
      } catch (e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject('Either video could not be found or no song was identified.');
    }
  }
}
