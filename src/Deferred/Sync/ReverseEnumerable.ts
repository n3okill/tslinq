import { Enumerable } from "../../internal";

export class ReverseEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>) {
        super(source);
    }

    override [Symbol.iterator](): Iterator<T> {
        return this._Reverse();
    }
    private *_Reverse() {
        const result = Array.from(this._source); //(this._source as Enumerable<T>).toArray();
        let length = result.length;
        while (length--) {
            yield result[length];
        }
    }
}
