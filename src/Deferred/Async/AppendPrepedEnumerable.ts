import { EnumerableAsync, Interfaces } from "../../internal";

export class AppendPrependEnumerable<T> extends EnumerableAsync<T> {
    constructor(source: EnumerableAsync<T>, private readonly _item: T, private readonly _isAppend: boolean = true) {
        super(source);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._AppendPrepend();
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private async *_AppendPrepend() {
        if (this._isAppend) {
            yield* this._source as Interfaces.IAsyncEnumerable<T>;
        }
        yield this._item;
        if (!this._isAppend) {
            yield* this._source as Interfaces.IAsyncEnumerable<T>;
        }
    }
}
