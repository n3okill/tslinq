export class OutOfRangeException extends RangeError {
  constructor(field: string) {
    super(`'${field}' is out of range`);
  }
}
