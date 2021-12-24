import { EnumerableAsync, Interfaces, Types } from "../../internal";

export class DistinctByEnumerable<T, TKey> extends EnumerableAsync<T> {
    constructor(source: EnumerableAsync<T>, private readonly _keySelector: Types.TKeySelectorAsync<T, TKey>, private readonly _comparer: Interfaces.IEqualityComparer<TKey> | Interfaces.IAsyncEqualityComparer<TKey>) {
        super(source);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._DistinctBy();
    }

    private async *_DistinctBy() {
        const exists = new Set<TKey>();
        const iterator = this._source[Symbol.asyncIterator]();
        let current = await iterator.next();
        loop1: while (current.done !== true) {
            const iteratorSet = exists[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            const key = await this._keySelector(current.value);
            while (currentSet.done !== true) {
                if (await this._comparer.Equals(currentSet.value, key)) {
                    current = await iterator.next();
                    continue loop1;
                }
                currentSet = iteratorSet.next();
            }
            exists.add(key);
            yield current.value;
            current = await iterator.next();
        }
    }
}
