import { EnumerableAsync, Types } from "../../internal";

export class ExceptByEnumerable<T, TKey> extends EnumerableAsync<T> {
    constructor(source: EnumerableAsync<T>, private _second: Iterable<TKey>, private readonly _keySelector: Types.TKeySelectorAsync<T, TKey>, private _comparer: Types.TIAsyncEqualityComparer<TKey>) {
        super(source);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._ExceptBy();
    }
    private async *_ExceptBy() {
        const exists = new Set(this._second);
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
