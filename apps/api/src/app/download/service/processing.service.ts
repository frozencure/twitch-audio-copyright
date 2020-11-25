import { Injectable, Logger } from '@nestjs/common';
import { AcrCloudService } from '../../acr_cloud/acr-cloud.service';
import { IdentifiedSongsService } from '../../database/identified-song/identified-songs.service';
import { VodSegmentList } from '../model/vod-segment-list';
import { VodAudioFile } from '../model/vod-file';
import { AudioChunkFile } from '../model/vod-chunk-file';


@Injectable()
export class ProcessingService {


  constructor(private readonly acrService: AcrCloudService,
              private readonly identifiedSongsService: IdentifiedSongsService) {
  }


  public async processAudioChunksForVideo(vodAudioFile: VodAudioFile, vodList: VodSegmentList): Promise<void> {
    try {
      const audioFiles = await vodList.getAudioChunks();
      for (let i = 0; i < audioFiles.length; i++) {
        await this.processAudioChunk(audioFiles[i], vodAudioFile);
      }
    } catch (e) {
      Logger.error(`Could not process audio files for VOD ${vodAudioFile.vodId}. Reason: ${e}`);
    }
  }


  private async processAudioChunk(audioChunk: AudioChunkFile, vodAudioFile: VodAudioFile): Promise<void> {
    try {
      const acrResult = await this.acrService.identify(audioChunk.filePath);
      if (!acrResult.hasEmptyResult()) {
        await this.identifiedSongsService.insertIdentifiedSong(vodAudioFile.vodId,
          ProcessingService.getIdentificationStart(audioChunk, vodAudioFile),
          ProcessingService.getIdentificationEnd(audioChunk, vodAudioFile,
            acrResult.chunkDurationInSeconds),
          acrResult.acrCloudDto);
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
