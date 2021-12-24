import { Enumerable } from "../../internal";

export class TakeLastEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>, public _count: number) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._TakeLast();
    }
    private *_TakeLast() {
        const iterator = this._source[Symbol.iterator]();
        const result: Array<T> = [];
        let current;
        while ((current = iterator.next()) && current.done !== true) {
            if (result.length < this._count) {
                result.push(current.value);
            } else {
                do {
                    result.shift() as T;
                    result.push(current.value);
                } while ((current = iterator.next()) && current.done !== true);
                break;
            }
        }
        while (result.length) {
            yield result.shift() as T;
        }
    }
}
