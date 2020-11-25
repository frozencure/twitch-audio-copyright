

export class FingerprintCreationError extends Error {
  constructor(message) {
    super(message);
    this.name = "FingerprintCreationError";
  }
}
