import { Enumerable } from "../../internal";

export class RepeatEnumerable<T> extends Enumerable<T> {
    constructor(source: Enumerable<T> /*, private readonly _element: T, private readonly _count: number*/) {
        super(source);
    }
    override [Symbol.iterator](): Iterator<T> {
        return this._Repeat();
    }
    private *_Repeat() {
        const iterator = this._source[Symbol.iterator]();
        let current = iterator.next();
        while (current.done !== true) {
            yield current.value;
            current = iterator.next();
        }
    }

    public static Generate<TSource>(element: TSource, count: number): RepeatEnumerable<TSource> {
        const result = [];
        let i = count;
        while (i--) {
            result.push(element);
        }
        return new RepeatEnumerable(Enumerable.asEnumerable(result));
    }
}
