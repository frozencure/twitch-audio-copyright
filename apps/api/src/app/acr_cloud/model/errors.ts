export class FingerprintCreationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FingerprintCreationError';
  }
}

export class EmptyFingerprintError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmptyFingerprintError';
  }
}

export class AcrEmptyResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AcrEmptyResponseError';
  }
}

export class AcrStatusResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AcrStatusResponseError';
  }
}
