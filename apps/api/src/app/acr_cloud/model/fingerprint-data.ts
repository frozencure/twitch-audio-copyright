

export class FingerprintData {

  fileDuration: number;
  data: string[];


  constructor(fileDuration: number, data: string[]) {
    this.fileDuration = fileDuration;
    this.data = data;
  }
}
