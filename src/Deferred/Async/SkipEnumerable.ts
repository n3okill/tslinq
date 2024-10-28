import { EnumerableAsync } from "../../internal";

export class SkipEnumerable<T> extends EnumerableAsync<T> {
  constructor(
    source: EnumerableAsync<T>,
    public _count: number,
  ) {
    super(source);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Skip(this._count);
  }
  private async *_Skip(count: number) {
    const iterator = this._source[Symbol.asyncIterator]();
    while (count > 0 && !(await iterator.next()).done) count--;
    if (count <= 0) {
      let current;
      while ((current = await iterator.next()) && current.done !== true) yield current.value;
    }
  }
}
