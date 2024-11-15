import { EnumerableAsync } from "../../internal";

export class SelectEnumerable<T, TResult> extends EnumerableAsync<TResult> {
  constructor(
    source: EnumerableAsync<T>,
    private readonly _selector: (x: T, index: number) => TResult | Promise<TResult>,
  ) {
    super(source as unknown as EnumerableAsync<TResult>);
  }
  override [Symbol.asyncIterator](): AsyncIterator<TResult> {
    return this._Select();
  }
  private async *_Select() {
    const iterator = this._source[Symbol.asyncIterator]() as AsyncIterator<T>;
    let current = await iterator.next();
    let index = 0;
    while (current.done !== true) {
      yield await this._selector(current.value, index++);
      current = await iterator.next();
    }
  }
}
