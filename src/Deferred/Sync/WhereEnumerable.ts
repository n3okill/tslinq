import { Enumerable } from "../../internal";

export class WhereEnumerable<T> extends Enumerable<T> {
  constructor(
    source: Enumerable<T>,
    private readonly _predicate: (x: T, index: number) => boolean,
  ) {
    super(source);
  }

  override [Symbol.iterator](): Iterator<T> {
    return this._Where();
  }

  private *_Where() {
    const iterator = this._source[Symbol.iterator]();
    let current = iterator.next();
    let index = 0;
    while (current.done !== true) {
      if (this._predicate(current.value, index)) {
        yield current.value;
      }
      index++;
      current = iterator.next();
    }
  }
}
