import { Enumerable, Interfaces, Types } from "../../internal";

export class IntersectByEnumerable<T, TKey> extends Enumerable<T> {
    constructor(souce: Enumerable<T>, private readonly _second: Iterable<TKey>, private readonly _keySelector: Types.TKeySelector<T, TKey>, private readonly _comparer: Interfaces.IEqualityComparer<TKey>) {
        super(souce);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._IntersectBy();
    }
    private *_IntersectBy() {
        const exist = new Set(this._second);
        const iterator = this._source[Symbol.iterator]();
        let current = iterator.next();
        loop1: while (current.done !== true) {
            const iteratorSet = exist[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            const key = this._keySelector(current.value);
            while (currentSet.done !== true) {
                if (this._comparer.Equals(key, currentSet.value)) {
                    exist.delete(currentSet.value);
                    yield current.value;
                    current = iterator.next();
                    continue loop1;
                }
                currentSet = iteratorSet.next();
            }
            current = iterator.next();
        }
    }
}
