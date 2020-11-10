import { VodChunkFileType } from './vod-chunk-file-type';

export class VodChunkFile {

  filePath: string;
  chunkNumber: number;
  vodId: number;
  totalNumberOfChunks: number;
  type: VodChunkFileType;
  shouldDeleteFile: boolean


  constructor(filePath: string, chunkNumber: number, vodId: number, totalNumberOfChunks: number, type: VodChunkFileType,
  shouldDeleteFile: boolean) {
    this.filePath = filePath;
    this.chunkNumber = chunkNumber;
    this.vodId = vodId;
    this.totalNumberOfChunks = totalNumberOfChunks;
    this.type = type;
    this.shouldDeleteFile = shouldDeleteFile;
  }
}
