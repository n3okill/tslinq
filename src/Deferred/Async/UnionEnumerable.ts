import { EnumerableAsync, Interfaces } from "../../internal";

export class UnionEnumerable<T> extends EnumerableAsync<T> {
  constructor(
    first: EnumerableAsync<T>,
    private readonly _second: AsyncIterable<T>,
    private readonly _comparer: Interfaces.IEqualityComparer<T>,
  ) {
    super(first);
  }
  override [Symbol.asyncIterator](): AsyncIterator<T> {
    return this._Union();
  }

  private async *_Union() {
    const returned = new Set<T>();
    yield* this._UnionAux(this._source[Symbol.asyncIterator](), returned);
    yield* this._UnionAux(this._second[Symbol.asyncIterator](), returned);
  }

  private async *_UnionAux(iterator: AsyncIterator<T>, returned: Set<T>) {
    let current = await iterator.next();
    loop1: while (current.done !== true) {
      const iteratorSet = returned[Symbol.iterator]();
      let currentSet = iteratorSet.next();
      while (currentSet.done !== true) {
        if (this._comparer.Equals(currentSet.value, current.value)) {
          current = await iterator.next();
          continue loop1;
        }
        currentSet = iteratorSet.next();
      }
      returned.add(current.value);
      yield current.value;
      current = await iterator.next();
    }
  }
}
