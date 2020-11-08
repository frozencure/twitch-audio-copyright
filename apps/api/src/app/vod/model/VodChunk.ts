export class VodChunk {
  get fileName(): string {
    return this._fileName;
  }

  get downloadUrl(): string {
    return this._downloadUrl;
  }


  get duration(): number {
    return this._duration;
  }

  private _duration: number;
  private _downloadUrl: string;
  private _fileName: string;

  constructor(duration: number, downloadUrl: string, fileName: string) {
    this._downloadUrl = downloadUrl;
    this._duration = duration;
    this._fileName = fileName;
  }

}
