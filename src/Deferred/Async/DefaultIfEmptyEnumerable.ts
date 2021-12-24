import { EnumerableAsync } from "../../internal";

export class DefaultIfEmptyEnumerable<T> extends EnumerableAsync<T> {
    constructor(source: EnumerableAsync<T>, private readonly _defaultValue?: T) {
        super(source);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._DefaultIfEmpty();
    }
    private async *_DefaultIfEmpty() {
        const iterator = super[Symbol.asyncIterator]();
        const result = await iterator.next();
        if (result.done) {
            yield this._defaultValue as T;
        } else {
            yield* this._source;
        }
    }
}
