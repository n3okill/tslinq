import { Enumerable } from "../../internal";

export class ZipEnumerable<T, TSecond, TThird, TResult> extends Enumerable<TResult> {
  constructor(
    source: Enumerable<T>,
    private readonly _second: Iterable<TSecond>,
    private readonly _third: Iterable<TThird> | undefined,
    private readonly _resultSelector: CallableFunction,
  ) {
    super(source as unknown as Enumerable<TResult>);
  }

  override [Symbol.iterator](): Iterator<TResult> {
    return this._Zip();
  }
  private *_Zip() {
    const iterator1 = this._source[Symbol.iterator]() as Iterator<T>;
    const iterator2 = this._second[Symbol.iterator]();
    const iterator3 = this._third ? this._third[Symbol.iterator]() : [][Symbol.iterator]();

    let current1 = iterator1.next();
    let current2 = iterator2.next();
    let current3 = this._third ? iterator3.next() : { done: false, value: undefined };

    while (current1.done !== true && current2.done !== true && current3.done !== true) {
      if (this._third) {
        yield this._resultSelector(current1.value, current2.value, current3.value);
        current3 = iterator3.next();
      } else {
        yield this._resultSelector(current1.value, current2.value);
      }

      current1 = iterator1.next();
      current2 = iterator2.next();
    }

    for (
      let current1 = iterator1.next(), current2 = iterator2.next();
      current1.done !== true && current2.done !== true;
      current1 = iterator1.next(), current2 = iterator2.next()
    ) {
      yield this._resultSelector(current1.value, current2.value);
    }
  }
}
