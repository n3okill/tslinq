import { Enumerable } from "../../internal";

export class AppendPrependEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>, private readonly _item: T, private readonly _isAppend: boolean = true) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._AppendPrepend();
    }

    private *_AppendPrepend() {
        if (this._isAppend) {
            yield* this._source;
        }
        yield this._item;
        if (!this._isAppend) {
            yield* this._source;
        }
    }
}
