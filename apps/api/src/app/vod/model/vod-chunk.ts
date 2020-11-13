export class VodChunk {

  vodId: number;
  duration: number;
  downloadUrl: string;
  fileName: string;
  chunkNumber: number;
  totalNumberOfChunks: number;
  outputPath: string;
  /**
   * When true, file will be deleted after it is used for the next processing step.
   */
  shouldDeleteFile: boolean;

  constructor(vodId: number, duration: number, downloadUrl: string, fileName: string,
              chunkNumber: number, totalNumberOfChunks: number) {
    this.vodId = vodId;
    this.duration = duration;
    this.downloadUrl = downloadUrl;
    this.fileName = fileName;
    this.chunkNumber = chunkNumber;
    this.totalNumberOfChunks = totalNumberOfChunks;
  }
}
