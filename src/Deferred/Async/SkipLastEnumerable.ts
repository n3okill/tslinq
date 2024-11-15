import { EnumerableAsync } from "../../internal";

export class SkipLastEnumerable<T> extends EnumerableAsync<T> {
  constructor(
    source: EnumerableAsync<T>,
    public _count: number,
  ) {
    super(source);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._SkipLast();
  }
  private async *_SkipLast() {
    const iterator = this._source[Symbol.asyncIterator]();
    const result: Array<T> = [];
    let current;
    while ((current = await iterator.next()) && current.done !== true) {
      if (result.length === this._count) {
        do {
          yield result.shift() as T;
          result.push(current.value);
        } while ((current = await iterator.next()) && current.done !== true);
        break;
      } else {
        result.push(current.value);
      }
    }
  }
}
