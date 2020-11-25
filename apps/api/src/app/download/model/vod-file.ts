export class VodFile {
  filePath: string;
  vodId: number;
  chunkLengthInSeconds: number;
  shouldDeleteFile: boolean;
  downloadUrl: string;


  constructor(filePath: string, vodId: number, chunkLength: number, shouldDeleteFile: boolean, downloadUrl: string) {
    this.filePath = filePath;
    this.vodId = vodId;
    this.chunkLengthInSeconds = chunkLength;
    this.shouldDeleteFile = shouldDeleteFile;
    this.downloadUrl = downloadUrl;
  }
}

export class VodVideoFile extends VodFile {
}

export class VodAudioFile extends VodFile {
}
