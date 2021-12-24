import { Enumerable } from "../../internal";

export class SkipEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>, public _count: number) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._Skip(this._count);
    }
    private *_Skip(count: number) {
        const iterator = this._source[Symbol.iterator]();
        while (count > 0 && !iterator.next().done) count--;
        if (count <= 0) {
            let current;
            while ((current = iterator.next()) && current.done !== true) yield current.value;
        }
    }
}
