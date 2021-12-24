import { EnumerableAsync, Interfaces } from "../../internal";

export class DistinctEnumerable<T> extends EnumerableAsync<T> {
    constructor(source: EnumerableAsync<T>, private readonly _comparer: Interfaces.IEqualityComparer<T> | Interfaces.IAsyncEqualityComparer<T>) {
        super(source);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._Distinct();
    }

    private async *_Distinct() {
        const exists = new Set<T>();
        const iterator = this._source[Symbol.asyncIterator]();
        let current = await iterator.next();
        loop1: while (current.done !== true) {
            const iteratorSet = exists[Symbol.iterator]();
            let currentSet = iteratorSet.next();
            while (currentSet.done !== true) {
                if (await this._comparer.Equals(currentSet.value, current.value)) {
                    current = await iterator.next();
                    continue loop1;
                }
                currentSet = iteratorSet.next();
            }
            exists.add(current.value);
            yield current.value;
            current = await iterator.next();
        }
    }
}
