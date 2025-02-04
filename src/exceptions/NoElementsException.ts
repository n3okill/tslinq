export class NoElementsException extends Error {
  constructor() {
    super("Sequence contains no elements");
  }
}
