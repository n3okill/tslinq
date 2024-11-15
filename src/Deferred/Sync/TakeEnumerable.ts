import { Enumerable } from "../../internal";

export class TakeEnumerable<T> extends Enumerable<T> {
  constructor(
    source: Enumerable<T>,
    public _count: number,
  ) {
    super(source);
  }

  override [Symbol.iterator](): Iterator<T> {
    return this._Take(this._count);
  }
  private *_Take(count: number) {
    const iterator = this._source[Symbol.iterator]();
    let current;
    while ((current = iterator.next()) && current.done !== true && count-- > 0) yield current.value;
  }
}
