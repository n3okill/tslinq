export class InvalidElementsCollection extends Error {
  constructor(message: string) {
    super("Invalid Elements collection. " + message);
  }
}
