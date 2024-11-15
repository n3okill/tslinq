import { Enumerable } from "../../internal";

export class TakeWhileEnumerable<T> extends Enumerable<T> {
  constructor(
    source: Enumerable<T>,
    public predicate: (element: T, index: number) => boolean,
  ) {
    super(source);
  }
  override [Symbol.iterator](): Iterator<T> {
    return this._TakeWhile();
  }
  private *_TakeWhile() {
    const iterator = this._source[Symbol.iterator]();
    let current = iterator.next();
    let index = 0;
    while (current.done !== true) {
      if (!this.predicate(current.value, index)) {
        break;
      }
      yield current.value;
      index++;
      current = iterator.next();
    }
  }
}
