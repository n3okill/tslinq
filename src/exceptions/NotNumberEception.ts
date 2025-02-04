export class NotNumberException extends RangeError {
  constructor(message: string) {
    super(`'${message}' is not a number`);
  }
}
