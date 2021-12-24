import { EnumerableAsync, Types } from "../../internal";

export class UnionByEnumerable<T, TKey> extends EnumerableAsync<T> {
    constructor(first: EnumerableAsync<T>, private readonly _second: AsyncIterable<TKey>, private readonly _keySelector: Types.TKeySelectorAsync<T, TKey>, private readonly _comparer: Types.TIAsyncEqualityComparer<TKey>) {
        super(first);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._Union();
    }

    private async *_Union() {
        const returned = new Set<TKey>();
        yield* this._UnionAux(this._source[Symbol.asyncIterator](), returned);
        yield* this._UnionAux(this._second[Symbol.asyncIterator](), returned);
    }

    private async *_UnionAux(iterator: AsyncIterator<T | TKey>, returned: Set<TKey>) {
        let current = await iterator.next();
        loop1: while (current.done !== true) {
            const iteratorSet = returned[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            const key = await this._keySelector(current.value as T);
            while (currentSet.done !== true) {
                if (await this._comparer.Equals(currentSet.value, key)) {
                    current = await iterator.next();
                    continue loop1;
                }
                currentSet = iteratorSet.next();
            }
            returned.add(key);
            yield current.value as T;
            current = await iterator.next();
        }
    }
}
