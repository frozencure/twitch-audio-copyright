export class LabelNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "LabelNotFoundError";
  }
}

export class WikiDataNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "WikiDataNotFoundError";
  }
}
