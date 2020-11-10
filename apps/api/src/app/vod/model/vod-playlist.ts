import { VodChunk } from './vod-chunk';

export class VodPlaylist {
  constructor(vodId: number, vodChunks: Array<VodChunk>, durationInSecs: number) {
    this.vodChunks = vodChunks;
    this.durationInSecs = durationInSecs;
    this.vodId = vodId;
  }

  vodChunks: Array<VodChunk>;
  durationInSecs: number;
  vodId: number;

}
