import { VodChunkFile } from './vod-chunk-file';
/*
 * Can represent an audio file that has been create by concatenating multiple audio chunks.
 * Can also represent a text file that contains the paths to all chunks that will concatenated.
 */
export class AudioConcatFile {

  fileFullPath: string;
  audioChunks: Array<VodChunkFile>;
  /**
   * When true, file will be deleted after it is ued for the next processing step.
   */
  shouldDeleteFile: boolean

  constructor(fileFullPath: string, audioChunks: Array<VodChunkFile>, shouldDeleteFile: boolean) {
    this.fileFullPath = fileFullPath;
    this.audioChunks = audioChunks;
    this.shouldDeleteFile = shouldDeleteFile;
  }
}