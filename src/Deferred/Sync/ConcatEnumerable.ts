import { Enumerable } from "../../internal";

export class ConcatEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>, private _second: Iterable<T>) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._Concat();
    }

    private *_Concat() {
        yield* this._source;
        yield* this._second;
    }
}
