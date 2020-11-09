export class DownloadProgress {

  constructor(currentFileBatch: string[], totalCount: number, currentCount: number) {
    this.currentFileBatch = currentFileBatch;
    this.totalCount = totalCount;
    this.currentCount = currentCount;
  }

  currentFileBatch: string[];
  totalCount: number;
  currentCount: number;
}
