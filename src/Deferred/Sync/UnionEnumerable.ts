import { Enumerable, Interfaces } from "../../internal";

export class UnionEnumerable<T> extends Enumerable<T> {
    constructor(first: Enumerable<T>, private readonly _second: Iterable<T>, private readonly _comparer: Interfaces.IEqualityComparer<T>) {
        super(first);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._Union();
    }

    private *_Union() {
        const returned = new Set<T>();
        yield* this._UnionAux(this._source[Symbol.iterator](), returned);
        yield* this._UnionAux(this._second[Symbol.iterator](), returned);
    }

    private *_UnionAux(iterator: Iterator<T>, returned: Set<T>) {
        let current = iterator.next();
        loop1: while (current.done !== true) {
            const iteratorSet = returned[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            while (currentSet.done !== true) {
                if (this._comparer.Equals(currentSet.value, current.value)) {
                    current = iterator.next();
                    continue loop1;
                }
                currentSet = iteratorSet.next();
            }
            returned.add(current.value);
            yield current.value;
            current = iterator.next();
        }
    }
}
