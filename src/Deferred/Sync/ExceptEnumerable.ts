import { Enumerable, Interfaces } from "../../internal";

export class ExceptEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>, private _second: Iterable<T>, private _comparer: Interfaces.IEqualityComparer<T>) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._Except();
    }
    private *_Except() {
        const exists = new Set(this._second);
        const iterator = this._source[Symbol.iterator]();
        let current = iterator.next();
        loop1: while (current.done !== true) {
            const iteratorSet = exists[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            while (currentSet.done !== true) {
                if (this._comparer.Equals(currentSet.value, current.value)) {
                    current = iterator.next();
                    continue loop1;
                }
                currentSet = iteratorSet.next();
            }
            exists.add(current.value);
            yield current.value;
            current = iterator.next();
        }
    }
}
