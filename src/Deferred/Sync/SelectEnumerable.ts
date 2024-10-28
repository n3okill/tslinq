import { Enumerable } from "../../internal";

export class SelectEnumerable<T, TResult> extends Enumerable<TResult> {
  constructor(
    source: Enumerable<T>,
    private readonly _selector: (x: T, index: number) => TResult,
  ) {
    super(source as unknown as Enumerable<TResult>);
  }
  override [Symbol.iterator](): Iterator<TResult> {
    return this._Select();
  }
  private *_Select() {
    const iterator = this._source[Symbol.iterator]() as Iterator<T>;
    let current = iterator.next();
    let index = 0;
    while (current.done !== true) {
      yield this._selector(current.value, index++);
      current = iterator.next();
    }
  }
}
