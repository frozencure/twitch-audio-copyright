export class VodChunk {

  get downloadUrl(): string {
    return this._downloadUrl;
  }

  set downloadUrl(value: string) {
    this._downloadUrl = value;
  }

  get duration(): number {
    return this._duration;
  }

  private _duration: number;
  private _downloadUrl: string;

  constructor(duration: number, downloadUrl: string) {
    this._downloadUrl = downloadUrl;
    this._duration = duration;
  }

}
