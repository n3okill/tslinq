export class NotIterableException extends Error {
  constructor(name?: string) {
    super(
      name
        ? `Collection '${name}' is not iterable`
        : "Collection is not iterable",
    );
  }
}
