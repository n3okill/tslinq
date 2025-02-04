export class InvalidArgumentException extends Error {
  constructor(message?: string) {
    super(message ? message : "Null Argument exception.");
  }
}
