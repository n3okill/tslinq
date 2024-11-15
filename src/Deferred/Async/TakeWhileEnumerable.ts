import { EnumerableAsync } from "../../internal";

export class TakeWhileEnumerable<T> extends EnumerableAsync<T> {
  constructor(
    source: EnumerableAsync<T>,
    public predicate: (element: T, index: number) => boolean | Promise<boolean>,
  ) {
    super(source);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._TakeWhile();
  }
  private async *_TakeWhile() {
    const iterator = this._source[Symbol.asyncIterator]();
    let current = await iterator.next();
    let index = 0;
    while (current.done !== true) {
      if (!(await this.predicate(current.value, index))) {
        break;
      }
      yield current.value;
      index++;
      current = await iterator.next();
    }
  }
}
