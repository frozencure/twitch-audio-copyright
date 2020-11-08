export class VodQuality {

  get downloadUrl(): string {
    return this._downloadUrl;
  }

  set downloadUrl(value: string) {
    this._downloadUrl = value;
  }

  get quality(): string {
    return this._quality;
  }

  private _quality: string;
  private _downloadUrl: string;

  constructor(quality: string, downloadUrl: string) {
    this._downloadUrl = downloadUrl;
    this._quality = quality;
  }
}
