export class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class VideoNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "VideoNotFoundError";
  }
}

export class ClipNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClipNotFoundError";
  }
}
