export class NoActiveStreamMonitorError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoActiveStreamMonitorError';
  }
}
