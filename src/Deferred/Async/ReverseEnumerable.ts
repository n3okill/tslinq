import { EnumerableAsync } from "../../internal";

export class ReverseEnumerable<T> extends EnumerableAsync<T> {
  constructor(source: EnumerableAsync<T>) {
    super(source);
  }

  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Reverse();
  }
  private async *_Reverse() {
    const result = [];
    const iterator = this._source[Symbol.asyncIterator]();
    let current = await iterator.next();
    while (current.done !== true) {
      result.push(current.value);
      current = await iterator.next();
    }
    let length = result.length;
    while (length--) {
      yield result[length];
    }
  }
}
