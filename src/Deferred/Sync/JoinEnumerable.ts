import { Enumerable, Types, Interfaces } from "../../internal";

export class JoinEnumerable<TKey, TInner, TResult, T> extends Enumerable<TResult> {
    constructor(source: Enumerable<T>, private readonly _inner: Iterable<TInner>, private readonly _outerKeySelector: Types.TKeySelector<T, TKey>, private readonly _innerKeySelector: Types.TKeySelector<TInner, TKey>, private readonly _resultSelector: Types.TResultSelectorJoin<T, TInner, TResult>, private readonly _comparer: Interfaces.IEqualityComparer<TKey>) {
        super(source as unknown as Enumerable<TResult>);
    }

    override [Symbol.iterator](): Iterator<TResult> {
        return this._Join();
    }

    private *_Join() {
        const iteratorSource = this._source[Symbol.iterator]() as Iterator<T>;
        const returned = new Set();
        let currentSource = iteratorSource.next();
        while (currentSource.done !== true) {
            const keySource = this._outerKeySelector(currentSource.value);
            const iteratorInner = this._inner[Symbol.iterator]();
            let currentInner = iteratorInner.next();
            while (currentInner.done !== true) {
                //TODO: Verificar se isto não influência o resultado final
                if (!returned.has(currentInner.value)) {
                    const keyInner = this._innerKeySelector(currentInner.value);
                    if (this._comparer.Equals(keySource, keyInner)) {
                        returned.add(currentInner.value);
                        yield this._resultSelector(currentSource.value, currentInner.value);
                    }
                }
                currentInner = iteratorInner.next();
            }
            currentSource = iteratorSource.next();
        }
    }
}
