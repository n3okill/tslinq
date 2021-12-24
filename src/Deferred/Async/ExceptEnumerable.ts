import { EnumerableAsync, Types } from "../../internal";

export class ExceptEnumerable<T> extends EnumerableAsync<T> {
    constructor(source: EnumerableAsync<T>, private _second: Iterable<T>, private _comparer: Types.TIAsyncEqualityComparer<T>) {
        super(source);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._Except();
    }
    private async *_Except() {
        const exists = new Set(this._second);
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
