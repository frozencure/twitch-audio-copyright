export class VodChunkFile {

  filePath: string;
  chunkNumber: number;
  vodId: number;
  totalNumberOfChunks: number;
  shouldDeleteFile: boolean;


  constructor(filePath: string, chunkNumber: number, vodId: number, totalNumberOfChunks: number,
              shouldDeleteFile: boolean) {
    this.filePath = filePath;
    this.chunkNumber = chunkNumber;
    this.vodId = vodId;
    this.totalNumberOfChunks = totalNumberOfChunks;
    this.shouldDeleteFile = shouldDeleteFile;
  }
}

export class AudioChunkFile extends VodChunkFile {
}

export class VideoChunkFile extends VodChunkFile {
}
