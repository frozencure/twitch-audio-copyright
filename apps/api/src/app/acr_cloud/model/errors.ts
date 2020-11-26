

export class FingerprintCreationError extends Error {
  constructor(message) {
    super(message);
    this.name = "FingerprintCreationError";
  }
}


export class EmptyAcrCloudResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmptyAcrCloudResponseError";
  }
}
