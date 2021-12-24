import { EnumerableAsync, Types, Helpers } from "../../internal";

export class JoinEnumerable<TKey, TInner, TResult, T> extends EnumerableAsync<TResult> {
    private readonly _inner: AsyncIterable<TInner>;
    constructor(source: EnumerableAsync<T>, inner: AsyncIterable<TInner> | Iterable<TInner>, private readonly _outerKeySelector: Types.TKeySelectorAsync<T, TKey>, private readonly _innerKeySelector: Types.TKeySelectorAsync<TInner, TKey>, private readonly _resultSelector: Types.TResultSelectorJoinAsync<T, TInner, TResult>, private readonly _comparer: Types.TIAsyncEqualityComparer<TKey>) {
        super(source as unknown as EnumerableAsync<TResult>);
        this._inner = Helpers.asAsyncIterable(inner);
    }

    override [Symbol.asyncIterator](): AsyncIterator<TResult> {
        return this._Join();
    }

    private async *_Join() {
        const iteratorSource = this._source[Symbol.asyncIterator]() as AsyncIterator<T>;
        const returned = new Set();
        let currentSource = await iteratorSource.next();
        while (currentSource.done !== true) {
            const keySource = await this._outerKeySelector(currentSource.value);
            const iteratorInner = this._inner[Symbol.asyncIterator]();
            let currentInner = await iteratorInner.next();
            while (currentInner.done !== true) {
                if (!returned.has(currentInner.value)) {
                    const keyInner = await this._innerKeySelector(currentInner.value);
                    if (await this._comparer.Equals(keySource, keyInner)) {
                        returned.add(currentInner.value);
                        yield await this._resultSelector(currentSource.value, currentInner.value);
                    }
                }
                currentInner = await iteratorInner.next();
            }
            currentSource = await iteratorSource.next();
        }
    }
}
