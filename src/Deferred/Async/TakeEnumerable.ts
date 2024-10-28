import { EnumerableAsync } from "../../internal";

export class TakeEnumerable<T> extends EnumerableAsync<T> {
  constructor(
    source: EnumerableAsync<T>,
    public _count: number,
  ) {
    super(source);
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Take(this._count);
  }
  private async *_Take(count: number) {
    const iterator = this._source[Symbol.asyncIterator]();
    let current;
    while ((current = await iterator.next()) && current.done !== true && count-- > 0) yield current.value;
  }
}
