import { Injectable, Logger } from '@nestjs/common';
import { AcrCloudFileService } from '../../acr_cloud/files/acr-cloud-file.service';
import { IdentifiedSongsService } from '../../database/identified-song/identified-songs.service';
import { VodSegmentList } from '../model/vod-segment-list';
import { VodAudioFile } from '../model/vod-file';
import { AudioChunkFile } from '../model/vod-chunk-file';
import { ClipAudioFile } from '../model/clip-file';
import { ClipsService } from '../../database/clip/clips.service';
import { VideosService } from '../../database/video/videos.service';

@Injectable()
export class ProcessingService {

  constructor(private readonly acrService: AcrCloudFileService,
              private readonly clipsService: ClipsService,
              private readonly videosService: VideosService,
              private readonly identifiedSongsService: IdentifiedSongsService) {
  }

  public async processAudioForClip(clipAudioFile: ClipAudioFile): Promise<void> {
    try {
      const acrResult = await this.acrService.identify(clipAudioFile.filePath);
      if (!acrResult.hasEmptyResult()) {
        await this.identifiedSongsService.insertIdentifiedSongForClip(acrResult.acrCloudDto,
          clipAudioFile.clipId, 0, acrResult.chunkDurationInSeconds);
      } else {
        Logger.debug(`No song was identified for clip ${clipAudioFile.clipId}`);
      }
    } catch (e) {
      Logger.error(`Could not process audio file ${clipAudioFile.filePath}. Reason: ${e}`);
    }
  }

  public async processAudioChunksForVideo(vodAudioFile: VodAudioFile, vodList: VodSegmentList): Promise<void[]> {
    try {
      const audioFiles = await vodList.getAudioChunks();
      const identificationResults = audioFiles.map(file => this.processAudioChunk(file, vodAudioFile));
      return Promise.all(identificationResults);
    } catch (e) {
      Logger.error(`Could not process audio files for VOD ${vodAudioFile.vodId}. Reason: ${e}`);
    }
  }

  private async processAudioChunk(audioChunk: AudioChunkFile, vodAudioFile: VodAudioFile): Promise<void> {
    try {
      const acrResult = await this.acrService.identify(audioChunk.filePath);
      if (!acrResult.hasEmptyResult()) {
        await this.identifiedSongsService.insertIdentifiedSongForVideo(vodAudioFile.vodId,
          ProcessingService.getIdentificationStart(audioChunk, vodAudioFile),
          ProcessingService.getIdentificationEnd(audioChunk, vodAudioFile,
            acrResult.chunkDurationInSeconds),
          acrResult.acrCloudDto);
      } else {
        Logger.debug(`No song was identified for VOD ` +
          `${vodAudioFile.vodId}, chunk ${audioChunk.chunkNumber}`);
      }
    } catch (e) {
      Logger.error(`Could not process audio file ${audioChunk.filePath}. Reason: ${e}`);
    }
  }

  private static getIdentificationStart(audioChunk: AudioChunkFile, vodAudioFile: VodAudioFile): number {
    return audioChunk.chunkNumber * vodAudioFile.chunkLengthInSeconds;
  }

  private static getIdentificationEnd(audioChunk: AudioChunkFile, vodAudioFile: VodAudioFile, chunkDuration: number): number {
    return audioChunk.chunkNumber * vodAudioFile.chunkLengthInSeconds + chunkDuration;
  }
}
