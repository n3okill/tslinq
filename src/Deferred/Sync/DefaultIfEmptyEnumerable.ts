import { Enumerable } from "../../internal";

export class DefaultIfEmptyEnumerable<T> extends Enumerable<T> {
  constructor(
    source: Enumerable<T>,
    private readonly _defaultValue?: T,
  ) {
    super(source);
  }
  override [Symbol.iterator](): Iterator<T> {
    return this._DefaultIfEmpty();
  }
  private *_DefaultIfEmpty() {
    const iterator = super[Symbol.iterator]();
    const result = iterator.next();
    if (result.done) {
      yield this._defaultValue as T;
    } else {
      yield* this._source;
    }
  }
}
