import { EnumerableAsync } from "../../internal";

export class RepeatEnumerable<T> extends EnumerableAsync<T> {
  constructor(source: EnumerableAsync<T>) {
    super(source);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Repeat();
  }
  private async *_Repeat() {
    const iterator = this._source[Symbol.asyncIterator]();
    let current = await iterator.next();
    while (current.done !== true) {
      yield current.value;
      current = await iterator.next();
    }
  }

  public static Generate<TSource>(element: TSource, count: number): RepeatEnumerable<TSource> {
    const result = [];
    let i = count;
    while (i--) {
      result.push(element);
    }
    return new RepeatEnumerable(EnumerableAsync.asEnumerableAsync(result));
  }
}
