import { EnumerableAsync } from "../../internal";

export class OfTypeEnumerable<T, TType> extends EnumerableAsync<TType> {
  private readonly _typeCheck: (x: T) => boolean;
  constructor(source: EnumerableAsync<T>, type: TType) {
    super(source as unknown as EnumerableAsync<TType>);
    this._typeCheck = typeof type === "string" ? (x: T) => typeof x === type : (x: T) => x instanceof (type as never);
  }

  override [Symbol.asyncIterator](): AsyncIterator<TType> {
    return this._OfType();
  }
  private async *_OfType() {
    const iterator = this._source[Symbol.asyncIterator]();
    let current = await iterator.next();
    while (current.done !== true) {
      if (this._typeCheck(current.value as unknown as T)) {
        yield current.value;
      }
      current = await iterator.next();
    }
  }
}
