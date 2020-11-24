export class ClipFile {
  filePath: string;
  clipId: string;
  shouldDeleteFile: boolean;
  downloadUrl: string;


  constructor(filePath: string, clipId: string, shouldDeleteFile: boolean, downloadUrl: string) {
    this.filePath = filePath;
    this.clipId = clipId;
    this.shouldDeleteFile = shouldDeleteFile;
    this.downloadUrl = downloadUrl;
  }
}


export class ClipVideoFile extends ClipFile {
}

export class ClipAudioFile extends ClipFile {
}
