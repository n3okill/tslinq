import { EnumerableAsync } from "../../internal";

export class TakeLastEnumerable<T> extends EnumerableAsync<T> {
  constructor(
    source: EnumerableAsync<T>,
    public _count: number,
  ) {
    super(source);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._TakeLast();
  }
  private async *_TakeLast() {
    const iterator = this._source[Symbol.asyncIterator]();
    const result: Array<T> = [];
    let current;
    while ((current = await iterator.next()) && current.done !== true) {
      if (result.length < this._count) {
        result.push(current.value);
      } else {
        do {
          result.shift() as T;
          result.push(current.value);
        } while ((current = await iterator.next()) && current.done !== true);
        break;
      }
    }
    while (result.length) {
      yield result.shift() as T;
    }
  }
}
