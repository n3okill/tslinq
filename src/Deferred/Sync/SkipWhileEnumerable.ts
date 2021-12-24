import { Enumerable } from "../../internal";

export class SkipWhileEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T>, public predicate: (element: T, index: number) => boolean) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._SkipWhile();
    }
    private *_SkipWhile() {
        const iterator = this._source[Symbol.iterator]();
        let current = iterator.next();
        let index = 0;
        while (current.done !== true) {
            if (!this.predicate(current.value, index)) {
                yield current.value;
            }
            index++;
            current = iterator.next();
        }
    }
}
