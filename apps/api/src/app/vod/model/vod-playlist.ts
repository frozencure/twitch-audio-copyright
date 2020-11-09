import { VodChunk } from './vod-chunk';

export class VodPlaylist {
  constructor(vodChunks: Array<VodChunk>, durationInSecs: number) {
    this._vodChunks = vodChunks;
    this._durationInSecs = durationInSecs;
  }

  get durationInSecs(): number {
    return this._durationInSecs;
  }

  get vodChunks(): Array<VodChunk> {
    return this._vodChunks;
  }

  private _vodChunks: Array<VodChunk>;
  private _durationInSecs: number;

}
