import { Enumerable } from "../../internal";

export class SkipLastEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>, public _count: number) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._SkipLast();
    }
    private *_SkipLast() {
        const iterator = this._source[Symbol.iterator]();
        const result: Array<T> = [];
        let current;
        while ((current = iterator.next()) && current.done !== true) {
            if (result.length === this._count) {
                do {
                    yield result.shift() as T;
                    result.push(current.value);
                } while ((current = iterator.next()) && current.done !== true);
                break;
            } else {
                result.push(current.value);
            }
        }
    }
}
